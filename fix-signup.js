const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Signup.jsx', 'utf8');

c = c.replace('import ElaraLogo', 'import { useSignup } from "../hooks/useAuth";\nimport ElaraLogo');

const stateRegex = /const \[showPassword, setShowPassword\] = useState\(false\);\s*const \[isLoading, setIsLoading\] = useState\(false\);\s*const searchParams = useSearchParams\(\);\s*const role = searchParams\.get\("role"\) \|\| 'customer';/;
c = c.replace(stateRegex, "const searchParams = useSearchParams();\n  const role = searchParams.get(\"role\") || 'customer';\n  const { name, setName, login, setLogin, password, setPassword, showPassword, setShowPassword, isSubmitting, handleSubmit, errors } = useSignup(role, \"/admin\");");

c = c.replace(/const handleSignup =[\s\S]*?1500\);\n  };/, '');
c = c.replace('onSubmit={handleSignup}', 'onSubmit={handleSubmit}');
c = c.replace(/disabled={isLoading}/g, 'disabled={isSubmitting}');
c = c.replace(/isLoading={isLoading}/g, 'isLoading={isSubmitting}');

c = c.replace(
  '<Input\n            id="fullname"\n            label="Full name"\n            type="text"\n            icon={User}\n            placeholder="Jane Doe"\n            disabled={isSubmitting}\n          />',
  '<Input\n            id="fullname"\n            label="Full name"\n            type="text"\n            icon={User}\n            placeholder="Jane Doe"\n            disabled={isSubmitting}\n            value={name}\n            onChange={(e) => setName(e.target.value)}\n            error={errors.name}\n          />'
);

c = c.replace(
  '<Input\n            id="email"\n            label="Email address"\n            type="email"\n            icon={Mail}\n            placeholder="name@example.com"\n            disabled={isSubmitting}\n          />',
  '<Input\n            id="email"\n            label="Email address"\n            type="email"\n            icon={Mail}\n            placeholder="name@example.com"\n            disabled={isSubmitting}\n            value={login}\n            onChange={(e) => setLogin(e.target.value)}\n            error={errors.login}\n          />'
);

c = c.replace(
  '<Input\n            id="password"\n            label="Create a password"\n            type={showPassword ? "text" : "password"}\n            icon={Lock}\n            actionIcon={showPassword ? EyeOff : Eye}\n            onActionClick={() => setShowPassword(!showPassword)}\n            placeholder="????????"\n            disabled={isSubmitting}\n          />',
  '<Input\n            id="password"\n            label="Create a password"\n            type={showPassword ? "text" : "password"}\n            icon={Lock}\n            actionIcon={showPassword ? EyeOff : Eye}\n            onActionClick={() => setShowPassword(!showPassword)}\n            placeholder="••••••••"\n            disabled={isSubmitting}\n            value={password}\n            onChange={(e) => setPassword(e.target.value)}\n            error={errors.password}\n          />'
);

fs.writeFileSync('src/features/market-pages/Signup.jsx', c);
