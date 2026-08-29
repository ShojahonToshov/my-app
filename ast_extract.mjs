import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const IGNORED_STRINGS = new Set([
  '/', '#', '', 'div', 'span', 'button', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'svg', 'path', 'circle', 'line', 'rect', 'use', 'nav', 'header', 'footer', 'main', 'section', 'article', 'aside', 'ul', 'ol', 'li', 'form', 'input', 'label', 'textarea', 'select', 'option', 'iframe', 'canvas', 'br', 'hr',
  'submit', 'button', 'text', 'password', 'email', 'tel', 'number', 'search', 'date', 'time', 'checkbox', 'radio', 'file', 'hidden', 'color', 'range',
  'true', 'false', 'null', 'undefined',
  'en', 'ru', 'uz', '1', '0', '2', '3', '4', '5', '6', '7', '8', '9',
  'GET', 'POST', 'PUT', 'DELETE', 'PATCH',
  'application/json', 'multipart/form-data',
  'sm', 'md', 'lg', 'xl', '2xl', '3xl',
  'px', 'rem', 'em', 'vh', 'vw', '%', 'auto',
]);

const IGNORED_ATTRS = new Set([
  'className', 'id', 'name', 'type', 'key', 'href', 'src', 'alt', 'width', 'height', 'viewBox', 'xmlns', 'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'd', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'transform', 'rel', 'target', 'method', 'action', 'encType', 'value', 'defaultValue', 'htmlFor', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'tabIndex', 'dir', 'lang', 'style',
  'variant', 'size', 'color', 'align', 'justify', 'direction', 'wrap', 'position', 'display', 'overflow', 'border', 'rounded', 'shadow', 'text', 'bg', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'gap', 'w', 'h', 'minW', 'minH', 'maxW', 'maxH',
  'initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap',
]);

const results = [];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node) {
    if (ts.isJsxText(node)) {
      const text = node.text.trim();
      if (text && !IGNORED_STRINGS.has(text) && /[a-zA-ZА-Яа-яЁё]/.test(text)) {
         if (!text.startsWith('{') && !text.startsWith('t(')) {
             results.push({ file: filePath, line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1, text, type: 'JSXText' });
         }
      }
    } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      let text = node.text;
      
      // Check parent to see if it's an attribute
      let isVisibleAttr = false;
      let p = node.parent;
      if (ts.isJsxAttribute(p)) {
        if (!IGNORED_ATTRS.has(p.name.text)) {
           isVisibleAttr = true;
        }
      } else if (ts.isJsxExpression(p) && ts.isJsxAttribute(p.parent)) {
         if (!IGNORED_ATTRS.has(p.parent.name.text)) {
           isVisibleAttr = true;
         }
      } else if (ts.isConditionalExpression(p) && ts.isJsxExpression(p.parent) && ts.isJsxElement(p.parent.parent)) {
          isVisibleAttr = true; // ternary inside JSX {}
      } else if (ts.isConditionalExpression(p) && ts.isJsxExpression(p.parent) && ts.isJsxAttribute(p.parent.parent)) {
         if (!IGNORED_ATTRS.has(p.parent.parent.name.text)) {
             isVisibleAttr = true;
         }
      }
      
      // Also catch conditional text in JSX
      if (p && ts.isConditionalExpression(p)) {
         let pp = p.parent;
         while(pp && !ts.isJsxElement(pp) && !ts.isJsxFragment(pp) && !ts.isJsxAttribute(pp) && !ts.isReturnStatement(pp)) {
             pp = pp.parent;
         }
         if (pp && (ts.isJsxElement(pp) || ts.isJsxFragment(pp))) {
             isVisibleAttr = true;
         }
      }

      if (isVisibleAttr && text && text.length > 1 && !IGNORED_STRINGS.has(text) && /[a-zA-ZА-Яа-яЁё]/.test(text)) {
          // ignore classnames
          if (!text.includes(' ') && (text.startsWith('bg-') || text.startsWith('text-') || text.startsWith('flex'))) {
              // skip
          } else if (text.startsWith('/')) {
              // skip routes
          } else {
             results.push({ file: filePath, line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1, text, type: 'StringLiteral' });
          }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

walk(srcDir);

fs.writeFileSync('ast_untranslated.json', JSON.stringify(results, null, 2));
console.log(`Found ${results.length} potentially untranslated strings.`);
