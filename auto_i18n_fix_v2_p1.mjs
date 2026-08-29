import { Project, SyntaxKind, Node } from 'ts-morph';
import fs from 'fs';
import path from 'path';

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

const dict = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));
const enPath = 'public/localization/en/en.json';
const ruPath = 'public/localization/ru/ru.json';
const uzPath = 'public/localization/uz/uz.json';

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ruJson = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
const uzJson = JSON.parse(fs.readFileSync(uzPath, 'utf8'));

let maxIndex = 0;
if (enJson.extra) {
  for (const key of Object.keys(enJson.extra)) {
    if (key.startsWith('t')) {
      const idx = parseInt(key.slice(1));
      if (!isNaN(idx) && idx > maxIndex) maxIndex = idx;
    }
  }
} else {
  enJson.extra = {};
  ruJson.extra = {};
  uzJson.extra = {};
}

let nextIndex = maxIndex + 1;
const stringToKey = new Map();

function getKey(text) {
  if (stringToKey.has(text)) return stringToKey.get(text);
  
  for (const [k, v] of Object.entries(enJson.extra)) {
     if (v === text) {
         const fullKey = `extra.${k}`;
         stringToKey.set(text, fullKey);
         return fullKey;
     }
  }
  for (const [k, v] of Object.entries(enJson.app || {})) {
    if (v === text) {
        const fullKey = `app.${k}`;
        stringToKey.set(text, fullKey);
        return fullKey;
    }
 }

  if (!dict[text]) return null;

  const newKey = `t${nextIndex++}`;
  enJson.extra[newKey] = text;
  ruJson.extra[newKey] = dict[text].ru || text;
  uzJson.extra[newKey] = dict[text].uz || text;
  
  const fullKey = `extra.${newKey}`;
  stringToKey.set(text, fullKey);
  return fullKey;
}

let filesModified = 0;

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();
  if (!filePath.endsWith('.tsx')) continue;
  
  let modified = false;
  const componentsToInject = new Set();
  
  sourceFile.transform(traversal => {
    const node = traversal.visitChildren();
    
    let isMatch = false;
    let key = null;
    let returnNode = node;

    if (node.kind === SyntaxKind.JsxText) {
      const text = node.text.trim();
      if (text && dict[text]) {
        key = getKey(text);
        if (key) {
           isMatch = true;
           returnNode = traversal.factory.createJsxExpression(
             undefined,
             traversal.factory.createCallExpression(
               traversal.factory.createIdentifier('t'),
               undefined,
               [traversal.factory.createStringLiteral(key)]
             )
           );
        }
      }
    } else if (node.kind === SyntaxKind.StringLiteral || node.kind === SyntaxKind.NoSubstitutionTemplateLiteral) {
      const text = node.text;
      if (text && dict[text]) {
        key = getKey(text);
        if (key) {
           const parentKind = node.parent.kind;
           if (parentKind === SyntaxKind.JsxAttribute) {
               isMatch = true;
               returnNode = traversal.factory.createJsxExpression(
                 undefined,
                 traversal.factory.createCallExpression(
                   traversal.factory.createIdentifier('t'),
                   undefined,
                   [traversal.factory.createStringLiteral(key)]
                 )
               );
           } else if (
               parentKind === SyntaxKind.ConditionalExpression || 
               parentKind === SyntaxKind.BinaryExpression ||
               parentKind === SyntaxKind.ReturnStatement ||
               parentKind === SyntaxKind.PropertyAssignment ||
               parentKind === SyntaxKind.ArrayLiteralExpression ||
               parentKind === SyntaxKind.CallExpression
           ) {
               // Only translate if inside a component
               isMatch = true;
               returnNode = traversal.factory.createCallExpression(
                 traversal.factory.createIdentifier('t'),
                 undefined,
                 [traversal.factory.createStringLiteral(key)]
               );
           }
        }
      }
    }
    
    if (isMatch) {
      modified = true;
      // ts-morph node (not typescript compiler node)
      // Actually inside transform we are dealing with typescript compiler nodes.
      // So we can't easily walk up using ts-morph. 
      // But we can store the position and do it after!
    }
    
    return returnNode;
  });

  if (modified) {
    sourceFile.saveSync();
    filesModified++;
  }
}

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(ruPath, JSON.stringify(ruJson, null, 2));
fs.writeFileSync(uzPath, JSON.stringify(uzJson, null, 2));

console.log(`Phase 1 done. Modified ${filesModified} files.`);
