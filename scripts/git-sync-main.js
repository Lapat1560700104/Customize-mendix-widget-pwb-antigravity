const { execSync } = require('child_process');

function run() {
    try {
        // 1. Check current branch name
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        console.log(`Current branch: ${currentBranch}`);

        // 2. Check for uncommitted changes
        const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
        if (status) {
            console.warn('⚠️ Warning: You have uncommitted changes. Please commit or stash them before switching.');
            console.log(status);
            process.exit(1);
        }

        // 3. Switch to main branch if not already on it
        if (currentBranch !== 'main') {
            console.log('🔄 Switching to main branch...');
            execSync('git checkout main', { stdio: 'inherit' });
        }

        // 4. Fetch latest from origin
        console.log('📡 Fetching from origin...');
        execSync('git fetch origin', { stdio: 'inherit' });

        // 5. Compare local main with origin/main
        const counts = execSync('git rev-list --left-right --count main...origin/main', { encoding: 'utf8' }).trim();
        const [ahead, behind] = counts.split(/\s+/).map(Number);

        if (behind > 0) {
            console.log(`⬇️ Local main is behind origin/main by ${behind} commit(s). Pulling updates...`);
            execSync('git pull', { stdio: 'inherit' });
            console.log('✅ Local main successfully updated with new commits!');
        } else {
            console.log('✅ main branch is already up-to-date with origin/main.');
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

run();
