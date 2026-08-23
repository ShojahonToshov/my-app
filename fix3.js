const fs=require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const targetStr = `              </div>

                </p>

                <div className="mt-8 flex flex-wrap gap-4">`;

const replacement = `              </div>

                <div className="mt-8 flex flex-wrap gap-4">`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/components/Landing.tsx', content);
