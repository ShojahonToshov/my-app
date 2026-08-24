const fs = require('fs');

let useAuth = fs.readFileSync('src/hooks/useAuth.ts', 'utf8');
useAuth = useAuth.replace('"Successfully signed in"', '"Signed in successfully"');
useAuth = useAuth.replace('"Registration successful!"', '"Account created successfully"');
useAuth = useAuth.replace('"Error occurred during registration."', '"Failed to create account"');
fs.writeFileSync('src/hooks/useAuth.ts', useAuth, 'utf8');

let signup = fs.readFileSync('src/components/Signup.tsx', 'utf8');
signup = signup.replace('"Verification code sent!"', '"Verification code sent"');
signup = signup.replace('"Registration successful!"', '"Account created successfully"');
fs.writeFileSync('src/components/Signup.tsx', signup, 'utf8');

