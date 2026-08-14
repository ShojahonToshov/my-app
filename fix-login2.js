const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Login.jsx', 'utf8');

c = c.replace(/const \[showPassword, setShowPassword\] = useState\(false\);\s*const \[isLoading, setIsLoading\] = useState\(false\);\s*const handleLogin = \([\s\S]*?1500\);\s*};/, 
  'const { login, setLogin, password, setPassword, showPassword, setShowPassword, isSubmitting, handleSubmit, errors, rememberMe, setRememberMe } = useLogin("/admin");');

fs.writeFileSync('src/features/market-pages/Login.jsx', c);
