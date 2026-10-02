const fs = require('fs');
const path = require('path');

const dirs = [
    'd:/Toys Website/Customer Frontend/src/pages',
    'd:/Toys Website/Customer Frontend/src/components'
];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Make things much rounder (more playful)
            content = content.replace(/rounded-md/g, 'rounded-2xl');
            content = content.replace(/rounded-lg/g, 'rounded-[2rem]');
            
            // Add serif to headings
            content = content.replace(/<h1(.*?)className="(.*?)"/g, (match, p1, p2) => {
                if (!p2.includes('font-serif')) {
                    return `<h1${p1}className="${p2} font-serif"`;
                }
                return match;
            });
            content = content.replace(/<h2(.*?)className="(.*?)"/g, (match, p1, p2) => {
                if (!p2.includes('font-serif')) {
                    return `<h2${p1}className="${p2} font-serif"`;
                }
                return match;
            });

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated ' + file);
            }
        }
    }
}

dirs.forEach(processDir);
console.log('Done');
