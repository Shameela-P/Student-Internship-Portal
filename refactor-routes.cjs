const fs = require('fs');
const { globSync } = require('glob');

const files = globSync('src/routes/**/*.server.js');
const collectionsList = ['students', 'companies', 'internships', 'applications', 'admins', 'notifications', 'emailTemplates', 'systemLogs', 'messages'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('getDb')) return;

    let changed = false;

    // Detect used collections
    const used = collectionsList.filter(c => content.includes(`db.${c}`));
    if (used.length === 0) return;

    const fetchStr = `const db = {\n` + used.map(c => `\t\t${c}: await getCollection('${c}')`).join(',\n') + `\n\t};`;

    // 1. Change import
    if (content.includes("import { getDb")) {
        content = content.replace(/import\s+\{\s*([^}]*)\s*\}\s+from\s+['"]\$lib\/db['"];?/, (match, group) => {
            let imports = group.split(',').map(s => s.trim());
            imports = imports.filter(i => i !== 'getDb' && i !== 'saveDb');
            if (!imports.includes('getCollection')) imports.push('getCollection');
            if (content.includes('saveDb(') && !imports.includes('overwriteEntireDatabase')) imports.push('overwriteEntireDatabase');
            return `import { ${imports.join(', ')} } from '$lib/db';`;
        });
        changed = true;
    }

    // 2. Change load function to async
    if (content.includes('export function load(')) {
        content = content.replace('export function load(', 'export async function load(');
        changed = true;
    }

    // 3. Replace const db = getDb();
    content = content.replace(/const\s+db\s*=\s*getDb\(\);/g, fetchStr);
    content = content.replace(/let\s+db\s*=\s*getDb\(\);/g, fetchStr.replace('const db =', 'let db ='));

    // 4. Replace saveDb
    if (content.includes('saveDb(db)')) {
        content = content.replace(/saveDb\(db\);?/g, 'await overwriteEntireDatabase(db);');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Refactored ${file}`);
    }
});
