const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard-pages/Settings.tsx', 'utf8');

if (!content.includes('const [isLoading, setIsLoading] = useState(true);')) {
    content = content.replace(
        'const [businessId, setBusinessId] = useState<string | null>(null);',
        'const [businessId, setBusinessId] = useState<string | null>(null);\n  const [isLoading, setIsLoading] = useState(true);'
    );
    
    content = content.replace(
        'async function loadBusinessData() {',
        'async function loadBusinessData() {\n      setIsLoading(true);'
    );

    content = content.replace(
        'loadBusinessData();',
        'loadBusinessData().finally(() => setIsLoading(false));'
    );

    content = content.replace(
        'import {',
        'import { Skeleton } from "@/components/ui/Skeleton";\nimport {'
    );

    // Let's add skeleton for the venue profile form
    const formSearch = <form className="space-y-6" onSubmit={handleSaveVenue}>;
    const formReplace = <form className="space-y-6" onSubmit={handleSaveVenue}>
                  {isLoading && (
                    <div className="space-y-6 animate-pulse">
                      <div className="grid grid-cols-2 gap-6"><div className="h-12 bg-[#DCDCDA]/60 rounded-xl"></div><div className="h-12 bg-[#DCDCDA]/60 rounded-xl"></div></div>
                      <div className="h-12 bg-[#DCDCDA]/60 rounded-xl"></div>
                      <div className="h-24 bg-[#DCDCDA]/60 rounded-xl"></div>
                    </div>
                  )}
                  <div className={isLoading ? 'hidden' : 'block'}>;
                  
    content = content.replace(formSearch, formReplace);
    content = content.replace(
        '</form>',
        '</div>\n                </form>'
    );

    fs.writeFileSync('src/components/dashboard-pages/Settings.tsx', content, 'utf8');
}
