const fs = require('fs');
const path = require('path');

const replacements = [
    {
        file: 'frontend/src/components/main/navbar.tsx',
        changes: [
            { from: '{ label: "Catalog", href: "/catalog" }', to: '{ label: "Shop Kits", href: "/catalog" }' }
        ]
    },
    {
        file: 'frontend/src/components/main/footer.tsx',
        changes: [
            { from: '>Catalog</Link>', to: '>Shop Kits</Link>' }
        ]
    },
    {
        file: 'frontend/src/app/(main)/catalog/[slug]/holiday-details.tsx',
        changes: [
            { from: 'fontWeight: 500 }}>Catalog</a>', to: 'fontWeight: 500 }}>Shop Kits</a>' }
        ]
    },
    {
        file: 'frontend/src/app/(main)/catalog/[slug]/page.tsx',
        changes: [
            { from: '>Back to Catalog</Button>', to: '>Back to Shop Kits</Button>' }
        ]
    },
    {
        file: 'frontend/src/app/(main)/catalog/page.tsx',
        changes: [
            { from: 'Holiday catalog', to: 'Shop Kits' }
        ]
    },
    {
        file: 'frontend/src/app/(main)/subscription/plans-grid.tsx',
        changes: [
            { from: 'Browse A La Carte Catalog', to: 'Browse A La Carte Kits' }
        ]
    },
    {
        file: 'frontend/src/app/(protected)/account/account-client.tsx',
        changes: [
            { from: 'aria-label="Browse catalog and add a holiday"', to: 'aria-label="Browse kits and add a holiday"' },
            { from: '"Browse the catalog"', to: '"Browse kits"' },
            { from: '"Choose a holiday from the catalog"', to: '"Choose a holiday from the shop"' }
        ]
    },
    {
        file: 'frontend/src/app/(protected)/account/subscription/page.tsx',
        changes: [
            { from: 'View Catalog', to: 'Shop Kits' }
        ]
    }
];

let totalChanges = 0;
for (const req of replacements) {
    const fullPath = path.join(__dirname, '..', req.file);
    if (!fs.existsSync(fullPath)) {
        console.error("Missing file:", fullPath);
        continue;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    
    for (const change of req.changes) {
        if (content.includes(change.from)) {
            content = content.replace(change.from, change.to);
            changed = true;
            totalChanges++;
        } else {
            console.log("Could not find in " + req.file + ": " + change.from);
        }
    }
    
    if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Updated", req.file);
    }
}

console.log("Total replacements made:", totalChanges);
