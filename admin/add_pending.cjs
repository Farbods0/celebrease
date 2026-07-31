const fs = require('fs');
const path = require('path');

const dir = './src/routes/__main';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'route.tsx');

let count = 0;
files.forEach(file => {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');

    // Add import
    if (!content.includes('RouteSkeleton')) {
        content = 'import { RouteSkeleton } from "@/components/main/route-skeleton";\n' + content;
    }

    // Add pendingComponent
    if (!content.includes('pendingComponent:')) {
        content = content.replace(/component: RouteComponent,\s*}\);/, 'component: RouteComponent,\n    pendingComponent: RouteSkeleton,\n});');
        
        fs.writeFileSync(p, content);
        console.log('Updated', p);
        count++;
    }
});

console.log('Modified ' + count + ' files.');
