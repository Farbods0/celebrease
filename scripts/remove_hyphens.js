const fs = require('fs');
const path = require('path');

const replacements = {
    'two-way': 'two way',
    'Two-way': 'Two way',
    'add-ons': 'add ons',
    'Add-ons': 'Add ons',
    'Add-Ons': 'Add Ons',
    'add-on': 'add on',
    'Add-on': 'Add on',
    'auto-playing': 'auto playing',
    'third-party': 'third party',
    'accessibility-related': 'accessibility related',
    'placeholder-only': 'placeholder only',
    'Brand-new': 'Brand new',
    'Earth-kind': 'Earth kind',
    'Zero-Storage': 'Zero Storage',
    'Designer-curated': 'Designer curated',
    'A-La-Carte': 'A La Carte',
    'A-la-carte': 'A la carte',
    'opt-in': 'opt in',
    'region-appropriate': 'region appropriate',
    'individual-level': 'individual level',
    'machine-readable': 'machine readable',
    'one-way': 'one way',
    'plain-text': 'plain text',
    'non-exclusive': 'non exclusive',
    'non-transferable': 'non transferable',
    'non-commercial': 'non commercial',
    'real-estate': 'real estate',
    'outdoor-rated': 'outdoor rated',
    'temperature-stable': 'temperature stable',
    'conflict-of-law': 'conflict of law',
    'money-back': 'money back',
    'Non-Restorable': 'Non Restorable',
    'single-use': 'single use',
    'pre-noted': 'pre noted',
    'late-return': 'late return',
    '30-day': '30 day',
    'per-kit': 'per kit'
};

const sortedReplacements = Object.entries(replacements).sort((a, b) => b[0].length - a[0].length);

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = content;
            
            // Replace hyphenated words
            for (const [key, value] of sortedReplacements) {
                const regex = new RegExp('\\b' + key + '\\b', 'g');
                modified = modified.replace(regex, value);
            }
            
            // Replace spaced hyphens (e.g., " - ") that aren't inside math or code blocks
            // This is tricky, but let's replace " — " (em dash) globally with a space.
            modified = modified.replace(/ — /g, ' ');
            modified = modified.replace(/—/g, ' ');
            
            if (content !== modified) {
                fs.writeFileSync(fullPath, modified);
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'frontend/src/app'));
processDirectory(path.join(__dirname, 'frontend/src/components'));
