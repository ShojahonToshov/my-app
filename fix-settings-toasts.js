const fs = require('fs');

let settings = fs.readFileSync('src/components/dashboard-pages/Settings.tsx', 'utf8');

settings = settings.replace('"Profile saved successfully"', '"Profile saved"');
settings = settings.replace('"Error saving to DB: " + error.message', '"Failed to save: " + error.message');
settings = settings.replace('"Specialist added successfully"', '"Specialist added"');
settings = settings.replace('"Service deleted successfully"', '"Service deleted"');
settings = settings.replace('"Specialist deleted successfully"', '"Specialist deleted"');
settings = settings.replace('"Service updated successfully"', '"Service updated"');
settings = settings.replace('"Service added successfully"', '"Service added"');
settings = settings.replace('"Working hours saved successfully"', '"Working hours saved"');
settings = settings.replace('"Policies saved successfully"', '"Policies saved"');
settings = settings.replace('toast.success("Service status updated (Demo)");', '/* no-op */');
settings = settings.replace('toast.success("Specialist status updated");', '/* no-op */');
fs.writeFileSync('src/components/dashboard-pages/Settings.tsx', settings, 'utf8');

let dbSettings = fs.readFileSync('src/components/dashboard-pages/DashboardSettings.tsx', 'utf8');
dbSettings = dbSettings.replace('"Card updated successfully"', '"Card updated"');
dbSettings = dbSettings.replace('"Security info updated successfully"', '"Security info updated"');
dbSettings = dbSettings.replace('"Two-factor authentication enabled successfully (Demo)"', '"2FA enabled (Demo)"');
dbSettings = dbSettings.replace('"Account deletion requested (Demo)"', '"Account deletion requested"');
fs.writeFileSync('src/components/dashboard-pages/DashboardSettings.tsx', dbSettings, 'utf8');
