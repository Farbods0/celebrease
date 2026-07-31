const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
let count = 0;
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('<img\n') || content.includes('<img\r\n') || content.includes('<img ')) {
        const updated = content.replace(/<img[\s\n\r]+(?![^>]*loading=)/g, '<img loading="lazy" decoding="async"\n');
        if (content !== updated) {
            fs.writeFileSync(f, updated);
            console.log('Updated', f);
            count++;
        }
    }
});
console.log('Modified ' + count + ' files.');
