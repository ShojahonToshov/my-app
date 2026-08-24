const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf8');

content = content.replace(
    '<Toaster />',
    \<Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'white',
              color: '#121415',
              border: '1px solid #DCDCDA',
              borderRadius: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '16px',
            },
            className: 'font-sans text-[14px] font-medium tracking-tight',
            classNames: {
              success: 'text-[#4a6b53] border-[#e8efe9] bg-[#f2f7f3]',
              error: 'text-[#dc2626] border-[#fecaca] bg-[#fef2f2]',
              warning: 'text-[#d97706] border-[#fde68a] bg-[#fffbeb]',
              info: 'text-[#121415] border-[#DCDCDA] bg-white',
            }
          }}
        />\
);

fs.writeFileSync('src/app/layout.tsx', content, 'utf8');
