const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\joshu\\Documents\\GitHub\\pho-website';
const files = fs.readdirSync(dir).filter(f => f.startsWith('hospital-') && f.endsWith('.html'));

const correctQuote = `\n            <blockquote class="hospital-quote">"Sa PHO, Una ang Serbisyo!"</blockquote>`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Fix the remaining 'â€' corrupted quotes
    content = content.replace(/<blockquote class="hospital-quote">"Sa PHO, Una ang Serbisyo!â€ <\/blockquote>/g, 
                              '<blockquote class="hospital-quote">"Sa PHO, Una ang Serbisyo!"</blockquote>');
    
    // 2. Add the quote if it doesn't exist
    if (!content.includes('<blockquote class="hospital-quote">')) {
        content = content.replace(/(<h2 class="section-title">[^<]+<\/h2>)/, `$1${correctQuote}`);
        console.log(`Added missing quote to ${file}`);
    } else {
        console.log(`Fixed/Verified quote in ${file}`);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done');
