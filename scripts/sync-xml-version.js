const fs = require('fs');
const path = require('path');

// 1. Read package.json in the current working directory
const pkgPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) {
    console.error('⚠️ sync-xml-version: package.json not found in the current directory. Skipping sync.');
    process.exit(0);
}

let pkg;
try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (err) {
    console.error('❌ sync-xml-version: Failed to parse package.json:', err.message);
    process.exit(1);
}

const version = pkg.version;
if (!version) {
    console.error('❌ sync-xml-version: Version not found in package.json');
    process.exit(1);
}

// 2. Read package.xml in the src directory
const xmlPath = path.join(process.cwd(), 'src', 'package.xml');
if (!fs.existsSync(xmlPath)) {
    console.warn('⚠️ sync-xml-version: src/package.xml not found. Skipping version sync.');
    process.exit(0);
}

let xmlContent = fs.readFileSync(xmlPath, 'utf8');

// 3. Match and replace the version attribute inside <clientModule ... version="..." ...>
const versionRegex = /(<clientModule\s+[^>]*version=")[^"]*(")/;
if (!versionRegex.test(xmlContent)) {
    console.error('❌ sync-xml-version: Could not find <clientModule ... version="..." /> tag in src/package.xml');
    process.exit(1);
}

const updatedXmlContent = xmlContent.replace(versionRegex, `$1${version}$2`);

// 4. Write back to src/package.xml if there is a change
if (xmlContent !== updatedXmlContent) {
    try {
        fs.writeFileSync(xmlPath, updatedXmlContent, 'utf8');
        console.log(`✨ sync-xml-version: Successfully synchronized src/package.xml version to: ${version}`);
    } catch (err) {
        console.error('❌ sync-xml-version: Failed to write src/package.xml:', err.message);
        process.exit(1);
    }
} else {
    console.log(`ℹ️ sync-xml-version: src/package.xml version is already up-to-date (${version})`);
}
