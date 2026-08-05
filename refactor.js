const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'sup-frontend');

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(baseDir);

const particleRegex1 = /\/\/ Particle Background[\s\S]*?animateParticles\(\);/g;
const particleRegex2 = /const canvas = document\.getElementById\("particles"\);[\s\S]*?animateParticles\(\);/g;
const particleRegex3 = /let particles = \[\];[\s\S]*?requestAnimationFrame\(animateParticles\);\s*\n\s*\}/g;

let updatedCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Remove particle JS
  if (content.match(particleRegex1) || content.match(particleRegex2) || content.match(/animateParticles/)) {
    content = content.replace(particleRegex1, '');
    content = content.replace(particleRegex2, '');
    
    // Fallback manual replace
    const lines = content.split('\n');
    let inParticleBlock = false;
    const newLines = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('const canvas = document.getElementById("particles")') || line.includes('// Particle Background')) {
            inParticleBlock = true;
        }
        
        if (!inParticleBlock) {
            newLines.push(line);
        }
        
        if (inParticleBlock && (line.includes('animateParticles();') || line.includes('window.addEventListener(\'resize\''))) {
            if (line.includes('animateParticles();')) {
                // look ahead 5 lines for resize listener
                let hasResize = false;
                for (let j = 1; j <= 5 && i + j < lines.length; j++) {
                    if (lines[i+j].includes('resize')) {
                        hasResize = true;
                    }
                }
                if (!hasResize) inParticleBlock = false;
            }
            if (line.includes('});') && inParticleBlock) {
                inParticleBlock = false; // end of resize listener
            }
        }
    }
    content = newLines.join('\n');
    changed = true;
  }
  
  // 2. Inject phoenix-core.js and initialization
  if (!content.includes('phoenix-core.js')) {
    const relDepth = path.relative(path.dirname(file), baseDir);
    const scriptPath = relDepth === '' ? './phoenix-core.js' : `${relDepth}/phoenix-core.js`.replace(/\\/g, '/');
    
    // Insert before closing body
    content = content.replace('</body>', `<script src="${scriptPath}"></script>\n<script>Phoenix.init({ particles: true, theme: true, nav: true });</script>\n</body>`);
    changed = true;
  }
  
  // 3. Update CSS reference if inline styles are empty or if we want to ensure it has it
  // (Assuming it already has it)
  
  // 4. Ensure viewport meta exists
  if (!content.includes('name="viewport"')) {
      content = content.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
  }
}

console.log(`Updated ${updatedCount} HTML files!`);
