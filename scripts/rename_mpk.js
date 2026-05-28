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

// Generate date stamp: YYYYMMDD
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const date = String(now.getDate()).padStart(2, '0');
const dateStamp = `${year}${month}${date}`;

const standardMpkName = `${packagePath}.${widgetName}.mpk`;
// Append version and build date to filename (e.g. pwb.PwbDatePicker_1.0.0_20260528.mpk)
const versionedMpkName = `${packagePath}.${widgetName}_${version}_${dateStamp}.mpk`;

console.log(`\n--- Post-Release Script: Versioning MPK for ${widgetName} (${version}_${dateStamp}) ---`);

const distDir = path.join(process.cwd(), 'dist', version);
const distStandardMpk = path.join(distDir, standardMpkName);
const distVersionedMpk = path.join(distDir, versionedMpkName);

// 1. Clean old dated local MPK files (EXCLUDING the newly built standard one!)
if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir);
    const prefix = `${packagePath}.${widgetName}`;
    files.forEach(file => {
        if (file.startsWith(prefix) && file.endsWith('.mpk') && file !== standardMpkName) {
            console.log(`Cleaning old local dated MPK: ${file}`);
            fs.unlinkSync(path.join(distDir, file));
        }
    });
}

// 2. Rename the newly compiled standard MPK in dist to the dated version
if (fs.existsSync(distStandardMpk)) {
    console.log(`Renaming dist standard MPK to: ${versionedMpkName}`);
    fs.renameSync(distStandardMpk, distVersionedMpk);
} else {
    console.log(`Warning: Standard MPK not found in dist folder: ${distStandardMpk}`);
}

// 3. Handle in Mendix App widgets folder
const absoluteProjectPath = path.isAbsolute(projectPath)
    ? projectPath
    : path.resolve(process.cwd(), projectPath);

const targetWidgetsDir = path.join(absoluteProjectPath, 'widgets');

if (fs.existsSync(targetWidgetsDir)) {
    // Dynamic clean: Delete any existing MPKs in Mendix widgets folder with the same widget prefix
    // (This prevents having duplicate versioned/dated widgets in Mendix Studio Pro!)
    const files = fs.readdirSync(targetWidgetsDir);
    const prefix = `${packagePath}.${widgetName}`;
    files.forEach(file => {
        if (file.startsWith(prefix) && file.endsWith('.mpk')) {
            console.log(`Cleaning old versioned MPK in Mendix widgets folder: ${file}`);
            fs.unlinkSync(path.join(targetWidgetsDir, file));
        }
    });

    // Copy our newly dated versioned MPK into the Mendix widgets folder
    if (fs.existsSync(distVersionedMpk)) {
        console.log(`Copying dated versioned MPK to Mendix app widgets folder: ${versionedMpkName}`);
        fs.copyFileSync(distVersionedMpk, path.join(targetWidgetsDir, versionedMpkName));
    }
} else {
    console.log(`Mendix app widgets folder not found at: ${targetWidgetsDir}. Skipping copy.`);
}

console.log('--- MPK Versioning Complete! ---\n');
