const { execSync } = require('child_process');
const https = require('https');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// 1. Parse remote URL to find owner and repository name
let repoOwner = 'Lapat1560700104';
let repoName = 'Customize-mendix-widget-pwb-antigravity';
try {
    const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^.]+)(?:\.git)?/);
    if (match) {
        repoOwner = match[1];
        repoName = match[2];
    }
} catch (e) {
    console.error('⚠️ Could not parse git remote URL, using defaults.');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

// 2. Load token from .env file or environment variable
let token = process.env.GITHUB_TOKEN;
const envPath = path.join(__dirname, '..', '.env');
if (!token && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GITHUB_TOKEN\s*=\s*(.*)/);
    if (match) {
        token = match[1].trim();
    }
}

async function run() {
    try {
        if (!token) {
            console.log('🔑 GitHub Access Token not found.');
            token = await askQuestion('Please enter your GitHub PAT token: ');
            token = token.trim();
            if (!token) {
                console.error('❌ Token is required to create a Pull Request.');
                process.exit(1);
            }
            const save = await askQuestion('Would you like to save this token locally in .env? (y/n): ');
            if (save.toLowerCase().startsWith('y')) {
                fs.appendFileSync(envPath, `\nGITHUB_TOKEN=${token}\n`);
                console.log('✅ Token saved to .env (Make sure .env is ignored in git).');
            }
        }

        // Prompt for commit message
        const commitMsg = await askQuestion('📝 Enter commit message: ');
        if (!commitMsg.trim()) {
            console.error('❌ Commit message cannot be empty.');
            process.exit(1);
        }

        // Stage files
        console.log('📦 Staging files (git add .)...');
        execSync('git add .');

        // Commit files
        console.log('💾 Committing changes...');
        execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}" --author="Lapat tammakajorn <lapatbu104@outlook.co.th>"`, { stdio: 'inherit' });

        // Get current branch
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        if (currentBranch === 'main') {
            console.error('❌ You are on the main branch. Please commit from a feature branch.');
            process.exit(1);
        }

        // Push branch
        console.log(`🚀 Pushing branch "${currentBranch}" to origin...`);
        execSync(`git push -u origin ${currentBranch}`, { stdio: 'inherit' });

        // Create Pull Request
        console.log('✨ Creating Pull Request on GitHub...');
        const prTitle = commitMsg;
        const prBody = `This PR was automatically generated using the git-pr script.\n\nCommit: ${commitMsg}`;
        
        await createPullRequest(repoOwner, repoName, currentBranch, 'main', prTitle, prBody, token);
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        rl.close();
    }
}

function createPullRequest(owner, repo, head, base, title, body, token) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            title,
            body,
            head,
            base
        });

        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/${owner}/${repo}/pulls`,
            method: 'POST',
            headers: {
                'User-Agent': 'Node.js Git-PR Script',
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 201) {
                    const pr = JSON.parse(data);
                    console.log(`\n🎉 Pull Request created successfully!`);
                    console.log(`🔗 Link: \x1b[36m${pr.html_url}\x1b[0m`);
                    resolve(pr);
                } else {
                    console.error(`❌ GitHub API returned Status Code ${res.statusCode}`);
                    try {
                        const errObj = JSON.parse(data);
                        console.error('Message:', errObj.message);
                        if (errObj.errors) {
                            console.error('Errors:', JSON.stringify(errObj.errors, null, 2));
                        }
                    } catch (e) {
                        console.error('Response:', data);
                    }
                    reject(new Error(`API Error: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

run();
