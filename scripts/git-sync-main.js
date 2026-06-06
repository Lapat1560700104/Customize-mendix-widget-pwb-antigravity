const { execSync } = require('child_process');

function run() {
    try {
        // 1. Switch Branch back to main
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        if (currentBranch !== 'main') {
            console.log('🔄 Switching to main branch...');
            execSync('git checkout main', { stdio: 'inherit' });
        } else {
            console.log('ℹ️ Already on main branch.');
        }

        // 2. Pull latest main branch
        console.log('📡 Pulling latest changes for main...');
        execSync('git pull', { stdio: 'inherit' });
        console.log('✅ Successfully pulled latest changes!');

    } catch (err) {
        console.error('❌ Error during sync:', err.message);
        process.exit(1);
    }
}

run();
