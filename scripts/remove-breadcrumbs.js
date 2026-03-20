// Run this script to remove breadcrumbs from all pages
// Usage: node scripts/remove-breadcrumbs.js

const fs = require('fs');
const path = require('path');

function findFiles(dir, results = []) {
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        findFiles(full, results);
      } else if (item.endsWith('.js')) {
        results.push(full);
      }
    }
  } catch (e) {}
  return results;
}

const srcDir = path.join(__dirname, '..', 'src', 'app');
const files = findFiles(srcDir);
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('page-hero-breadcrumb')) {
    // Remove the breadcrumb div — handles multi-line with various content
    const regex = /\s*<div className="page-hero-breadcrumb">[\s\S]*?<\/div>\s*/g;
    const newContent = content.replace(regex, '\n');
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      count++;
      console.log('  Fixed:', path.relative(path.join(__dirname, '..'), file));
    }
  }
}

console.log('\n  Done! Removed breadcrumbs from ' + count + ' files.');
