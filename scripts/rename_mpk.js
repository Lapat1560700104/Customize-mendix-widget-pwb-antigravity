const fs = require('fs');
const path = require('path');

// Read the current widget's package.json
const pkgPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) {
    console.error('Error: package.json not found in current directory.');
    process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
const widgetName = pkg.widgetName;
const packagePath = pkg.packagePath || 'pwb';
const projectPath = pkg.config && pkg.config.projectPath ? pkg.config.projectPath : '../../';

const standardMpkName = `${packagePath}.${widgetName}.mpk`;
const versionedMpkName = `${packagePath}.${widgetName}_${version}.mpk`;

console.log(`\n--- Post-Release Script: Versioning MPK for ${widgetName} (${version}) ---`);

// 1. Rename in dist/{version}/ folder
const distDir = path.join(process.cwd(), 'dist', version);
const distStandardMpk = path.join(distDir, standardMpkName);
const distVersionedMpk = path.join(distDir, versionedMpkName);

if (fs.existsSync(distStandardMpk)) {
    console.log(`Renaming dist standard MPK to: ${versionedMpkName}`);
    fs.renameSync(distStandardMpk, distVersionedMpk);
} else {
    console.log(`Warning: Standard MPK not found in dist folder: ${distStandardMpk}`);
}

// 2. Handle in Mendix App widgets folder
const absoluteProjectPath = path.isAbsolute(projectPath)
    ? projectPath
    : path.resolve(process.cwd(), projectPath);

const targetWidgetsDir = path.join(absoluteProjectPath, 'widgets');

if (fs.existsSync(targetWidgetsDir)) {
    const targetStandardMpk = path.join(targetWidgetsDir, standardMpkName);
    const targetVersionedMpk = path.join(targetWidgetsDir, versionedMpkName);

    // Delete standard old MPK if Mendix build tools copied it automatically
    if (fs.existsSync(targetStandardMpk)) {
        console.log(`Cleaning old standard MPK in Mendix widgets folder...`);
        fs.unlinkSync(targetStandardMpk);
    }

    // Copy our versioned MPK into the Mendix widgets folder
    if (fs.existsSync(distVersionedMpk)) {
        console.log(`Copying versioned MPK to Mendix app widgets folder: ${targetVersionedMpk}`);
        fs.copyFileSync(distVersionedMpk, targetVersionedMpk);
    }
} else {
    console.log(`Mendix app widgets folder not found at: ${targetWidgetsDir}. Skipping copy.`);
}

console.log('--- MPK Versioning Complete! ---\n');
