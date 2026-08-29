import { Project, SyntaxKind } from 'ts-morph';
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

// Find starting index for new keys
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
const stringToKey = new Map(); // e.g. "Confirm Booking" -> "extra.t400"

function getKey(text) {
  if (stringToKey.has(text)) return stringToKey.get(text);
  
  // Check if it already exists in enJson.extra
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
  let needsI18n = false;
  
  sourceFile.transform(traversal => {
    const node = traversal.visitChildren();
    
    if (node.kind === SyntaxKind.JsxText) {
      const text = node.text.trim();
      if (text && dict[text]) {
        const key = getKey(text);
        if (key) {
           modified = true;
           needsI18n = true;
           // We have to keep the surrounding spaces if there were any, but it's simpler to just replace the whole node
           // Actually, standard JsxText replacement can be tricky with formatting.
           // Let's return a JsxExpression
           return traversal.factory.createJsxExpression(
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
        // check if parent is JsxAttribute or something where we can replace with a call
        const key = getKey(text);
        if (key) {
           const parentKind = node.parent.kind;
           if (parentKind === SyntaxKind.JsxAttribute) {
               modified = true;
               needsI18n = true;
               return traversal.factory.createJsxExpression(
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
               modified = true;
               needsI18n = true;
               return traversal.factory.createCallExpression(
                 traversal.factory.createIdentifier('t'),
                 undefined,
                 [traversal.factory.createStringLiteral(key)]
               );
           }
        }
      }
    }
    return node;
  });

  if (modified) {
    filesModified++;
    
    // Naively inject useI18n if needsI18n and not already present
    // First, check if t is already available
    const hasUseI18n = sourceFile.getFullText().includes('useI18n');
    if (!hasUseI18n && needsI18n) {
      // Find the first default export function and inject const { t } = useI18n();
      const defaultExport = sourceFile.getFunction(f => f.isDefaultExport());
      if (defaultExport) {
          defaultExport.insertStatements(0, 'const { t } = useI18n();');
          sourceFile.addImportDeclaration({
              namedImports: ['useI18n'],
              moduleSpecifier: '@/hooks/useI18n'
          });
      }
    }
    
    sourceFile.saveSync();
    console.log(`Updated ${filePath}`);
  }
}

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(ruPath, JSON.stringify(ruJson, null, 2));
fs.writeFileSync(uzPath, JSON.stringify(uzJson, null, 2));

console.log(`Done. Modified ${filesModified} files.`);
