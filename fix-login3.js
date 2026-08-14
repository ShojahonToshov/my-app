const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Login.jsx', 'utf8');

c = c.replace(/const \[showPassword, setShowPassword\] = useState\(false\);\s*const \[isLoading, setIsLoading\] = useState\(false\);\s*const handleLogin = \([\s\S]*?1500\);\s*};/, 
  'const { login, setLogin, password, setPassword, showPassword, setShowPassword, isSubmitting, handleSubmit, errors, rememberMe, setRememberMe } = useLogin("/admin");');

c = c.replace(/onSubmit={handleLogin}/g, 'onSubmit={handleSubmit}');
c = c.replace(/disabled={isLoading}/g, 'disabled={isSubmitting}');
c = c.replace(/isLoading={isLoading}/g, 'isLoading={isSubmitting}');

c = c.replace(
  '<Input\n            id="email"\n            label="Email or phone"\n            type="text"\n            icon={Mail}\n            placeholder="name@example.com"\n            disabled={isSubmitting}\n          />',
  '<Input\n            id="email"\n            label="Email or phone"\n            type="text"\n            icon={Mail}\n            placeholder="name@example.com"\n            disabled={isSubmitting}\n            value={login}\n            onChange={(e) => setLogin(e.target.value)}\n            error={errors?.login}\n          />'
);

c = c.replace(
  '<Input\n            id="password"\n            label="Password"\n            type={showPassword ? "text" : "password"}\n            icon={Lock}\n            actionIcon={showPassword ? EyeOff : Eye}\n            onActionClick={() => setShowPassword(!showPassword)}\n            placeholder="••••••••"\n            disabled={isSubmitting}\n          />',
  '<Input\n            id="password"\n            label="Password"\n            type={showPassword ? "text" : "password"}\n            icon={Lock}\n            actionIcon={showPassword ? EyeOff : Eye}\n            onActionClick={() => setShowPassword(!showPassword)}\n            placeholder="••••••••"\n            disabled={isSubmitting}\n            value={password}\n            onChange={(e) => setPassword(e.target.value)}\n            error={errors?.password}\n          />'
);

c = c.replace('type="checkbox"', 'type="checkbox"\n                  checked={rememberMe}\n                  onChange={(e) => setRememberMe(e.target.checked)}');

fs.writeFileSync('src/features/market-pages/Login.jsx', c);
