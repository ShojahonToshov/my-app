const fs = require('fs');
let dashboard = fs.readFileSync('src/components/dashboard-pages/Dashboard.tsx', 'utf8');

// Dashboard toast edits
dashboard = dashboard.replace('toast.success(${guest.name} called to chair);', 'toast.success(${guest.name} called to chair);'); // fine
dashboard = dashboard.replace('toast.success(Session with  completed);', 'toast.success(${guest.name}\\s session completed);');
dashboard = dashboard.replace('toast.info(${nextGuest.name} was automatically called in);', 'toast.info(${nextGuest.name} was auto-called in);');
// Remove spammy toast
dashboard = dashboard.replace('toast.info(No waiting customers left for );', '/* no-op */');
// Simplify delay toast
dashboard = dashboard.replace('toast.warning(+10 min delay applied to  customer(s) for );', 'toast.info(+10 min delay applied to  customer(s));');
dashboard = dashboard.replace('toast.success(${guest.name} moved to chair);', 'toast.success(${guest.name} moved to chair);'); // fine
dashboard = dashboard.replace('toast.info(${guest.name} moved to waiting queue);', 'toast.info(${guest.name} moved to waiting queue);');
dashboard = dashboard.replace('toast.success(isPaused ? "Bookings resumed" : "Bookings paused");', 'toast.success(isPaused ? "Queue is now open" : "Queue paused temporarily");');

fs.writeFileSync('src/components/dashboard-pages/Dashboard.tsx', dashboard, 'utf8');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
const oldToaster = /<Toaster[\s\S]*?\/>/g;
const newToaster = \<Toaster 
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
              success: 'text-[#121415] border-[#DCDCDA] bg-white', // neutral, modern success
              error: 'text-[#dc2626] border-[#fecaca] bg-white',
              warning: 'text-[#d97706] border-[#fde68a] bg-white',
              info: 'text-[#121415] border-[#DCDCDA] bg-[#F5F5F4]', // slightly distinct info
            }
          }}
        />\;

layout = layout.replace(oldToaster, newToaster);
fs.writeFileSync('src/app/layout.tsx', layout, 'utf8');

