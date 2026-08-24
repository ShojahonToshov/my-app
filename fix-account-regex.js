const fs = require('fs');
let account = fs.readFileSync('src/app/account/components/AccountClient.tsx', 'utf8');

account = account.replace(/toast\([^)]+\)/g, (match) => {
    if (match.includes("notifications.length > 0") || match.includes("")) {
        if (match.includes("toast.success")) return 'toast.success("Notifications cleared")';
        return 'toast.info("No new notifications")';
    }
    return match;
});

account = account.replace(/toast.success\("[^"]+"\)/g, 'toast.success("Notifications cleared")');
account = account.replace(/toast\("[^"]+"\)/g, 'toast.info("No new notifications")');
account = account.replace(/'Review submitted successfully'/g, "'Review submitted'");

fs.writeFileSync('src/app/account/components/AccountClient.tsx', account, 'utf8');
