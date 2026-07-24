const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'public', 'content');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.html'));

let scrubbedFiles = 0;

for (const file of files) {
  const filePath = path.join(contentDir, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  let originalHtml = html;

  // 1. Remove all <img> tags
  html = html.replace(/<img[^>]*>/gi, '');

  // 2. Remove all <div class="image-carousel-container">...</div>
  // Since HTML parsing with regex can be tricky with nested divs, we'll find the start of the container
  // and try to strip it roughly. We know it usually contains an image and buttons.
  // We can just use a non-greedy regex, but since we already removed imgs, the carousel might be mostly empty
  // Let's strip the carousel container entirely:
  html = html.replace(/<div class="image-carousel-container".*?<\/div><\/div><\/div><\/div>/gis, '');
  
  // A safer non-greedy fallback for carousels
  html = html.replace(/<div class="image-carousel-container".*?<\/svg><\/button><\/div><\/div><\/div>/gis, '');

  // 3. Remove any mention of "TUF" or "TUF+" (case insensitive, but mostly exactly those strings)
  html = html.replace(/TUF\+/g, 'DBMS Course');
  html = html.replace(/TUF/g, 'Course');

  if (html !== originalHtml) {
    fs.writeFileSync(filePath, html, 'utf-8');
    scrubbedFiles++;
  }
}

console.log(`Successfully scrubbed images and branding from ${scrubbedFiles} files.`);
