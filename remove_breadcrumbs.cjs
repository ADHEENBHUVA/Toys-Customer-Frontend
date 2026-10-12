const fs = require('fs');
const path = require('path');

const files = [
    'src/pages/Shipping.jsx',
    'src/pages/Terms.jsx',
    'src/pages/Returns.jsx',
    'src/pages/Products.jsx',
    'src/pages/ProductDetails.jsx',
    'src/pages/Privacy.jsx',
    'src/pages/FAQ.jsx',
    'src/pages/Contact.jsx',
    'src/pages/Blog.jsx',
    'src/pages/Cart.jsx'
];

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove breadcrumb wrapped in {/* Breadcrumb */}
        const regex1 = /\{\/\*\s*Breadcrumb\s*\*\/\}\s*<div[^>]*>[\s\S]*?<\/div>/g;
        // Sometimes the div is just a flex container with Home Link and a slash
        const regex2 = /<div[^>]*className="[^"]*gap-2[^"]*"[^>]*>\s*<Link to="\/"[^>]*>Home<\/Link>\s*<span[^>]*>\/<\/span>[\s\S]*?<\/div>\s*/g;
        
        let newContent = content.replace(regex1, '');
        newContent = newContent.replace(regex2, '');
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log('Modified ' + file);
        } else {
            console.log('No match in ' + file);
        }
    } else {
        console.log('Not found: ' + file);
    }
});
