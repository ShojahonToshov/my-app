const fs = require('fs');

let account = fs.readFileSync('src/app/account/components/AccountClient.tsx', 'utf8');

account = account.replace(/toast\([^)]+\)/g, (match) => {
    if (match.includes("toast(")) {
        if (match.includes("Mark all read") || match.includes(" 㢥 ⠭")) {
            return 'toast.success("Notifications cleared")';
        }
        if (match.includes("notifications.length > 0")) {
            return 'toast.info("No new notifications")';
        }
        return match;
    }
    return match;
});

account = account.replace(
    'onClick={() => notifications.length > 0 ? setShowNotifications(!showNotifications) : toast("    㢥")}',
    'onClick={() => notifications.length > 0 ? setShowNotifications(!showNotifications) : toast.info("No new notifications")}'
);

account = account.replace(
    'toast.success(" 㢥 ⠭");',
    'toast.success("Notifications cleared");'
);

account = account.replace('"Review submitted successfully"', '"Review submitted"');

fs.writeFileSync('src/app/account/components/AccountClient.tsx', account, 'utf8');

let customerBooking = fs.readFileSync('src/components/CustomerBooking.tsx', 'utf8');
customerBooking = customerBooking.replace('"Booking confirmed successfully!"', '"Booking confirmed"');
fs.writeFileSync('src/components/CustomerBooking.tsx', customerBooking, 'utf8');
