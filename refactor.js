const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files importing useAuthStore
const files = execSync('git grep -l "useAuthStore"').toString().split('\n').filter(Boolean);

for (const file of files) {
  const absolutePath = path.resolve(file);
  if (!fs.existsSync(absolutePath)) continue;
  
  if (file.includes('authStore.ts')) {
    // Keep the stores but clean them up? Or just empty them?
    // Let's replace the store content to just contain ephemeral state
    const cleanStore = `import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const useAuthStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export default useAuthStore;
`;
    fs.writeFileSync(absolutePath, cleanStore);
    continue;
  }

  let content = fs.readFileSync(absolutePath, 'utf8');

  // Replace import
  content = content.replace(/import useAuthStore from ['"](.*)stores\/authStore['"];?\n?/g, 'import useUser from "@/hooks/useUser";\n');
  content = content.replace(/import useGlobalAuthStore from ['"](.*)stores\/authStore['"];?\n?/g, '');
  content = content.replace(/import useMarketAuthStore from ['"](.*)stores\/authStore['"];?\n?/g, '');
  content = content.replace(/import useBusinessAuthStore from ['"](.*)stores\/authStore['"];?\n?/g, '');
  
  // Replace hook call
  content = content.replace(/const (\{.*\}) = useAuthStore\(\);/g, 'const $1 = useUser();');
  content = content.replace(/const (\{.*\}) = useMarketAuthStore\(\);/g, 'const $1 = useUser();');
  content = content.replace(/const (\{.*\}) = useBusinessAuthStore\(\);/g, 'const $1 = useUser();');
  content = content.replace(/const (\{.*\}) = useGlobalAuthStore\(\);/g, 'const $1 = useUser();');
  
  fs.writeFileSync(absolutePath, content);
  console.log('Updated ' + file);
}
