const fs=require('fs');
const path=require('path');
function walkDir(dir,cb){
  fs.readdirSync(dir).forEach(f=>{
    const p=path.join(dir,f);
    if(fs.statSync(p).isDirectory())walkDir(p,cb);
    else if(p.endsWith('.tsx'))cb(p);
  });
}
let count=0;
walkDir('c:/Users/user/Desktop/Elara/my-app/src',p=>{
  const c=fs.readFileSync(p,'utf8');
  // replace shape="pill" with shape="rounded"
  const n=c.replace(/shape="pill"/g, 'shape="rounded"');
  if(c!==n){
    fs.writeFileSync(p,n);
    count++;
  }
});
console.log('Done: '+count);
