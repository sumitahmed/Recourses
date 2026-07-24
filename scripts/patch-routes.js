const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, '..', 'src', 'lib');
const navPath = path.join(libDir, 'dbms-navigation.json');
const searchPath = path.join(libDir, 'dbms-search-index.json');

if (fs.existsSync(navPath)) {
  let nav = fs.readFileSync(navPath, 'utf-8');
  nav = nav.replace(/"url": "\/lesson\//g, '"url": "/resources/dbms/');
  fs.writeFileSync(navPath, nav, 'utf-8');
  console.log('Patched navigation.json');
}

if (fs.existsSync(searchPath)) {
  let search = fs.readFileSync(searchPath, 'utf-8');
  search = search.replace(/"url": "\/lesson\//g, '"url": "/resources/dbms/');
  fs.writeFileSync(searchPath, search, 'utf-8');
  console.log('Patched search-index.json');
}
