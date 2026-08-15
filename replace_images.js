const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('frontend/src/app', function(filePath) {
    if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content
            .replace(/cinco-de-mayo-premium-angle1\.jpg/g, 'cinco-de-mayo.jpg')
            .replace(/dia-de-los-muertos-premium-angle1\.jpg/g, 'dia-de-los-muertos.jpg')
            .replace(/holi-premium-angle1\.jpg/g, 'holi.jpg')
            .replace(/independence-day-premium-angle1\.jpg/g, 'independence-day.jpg')
            .replace(/st-patricks-day-premium-angle1\.jpg/g, 'st-patricks-day.jpg')
            .replace(/graduations-premium-angle1\.jpg/g, 'graduations.jpg')
            .replace(/lunar-new-year-premium-angle1\.jpg/g, 'lunar-new-year.jpg')
            .replace(/new-year-s-premium-angle1\.jpg/g, 'thanksgiving.jpg')
            .replace(/New Year's Eve/g, 'Thanksgiving')
            .replace(/"new year's eve"/g, '"thanksgiving"')
            .replace(/"new-years"/g, '"thanksgiving"');
            
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
