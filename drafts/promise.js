import { access } from 'node:fs/promises';

async function fn(path) {
    try {
        await access(path);
        console.log('Can access');
        return path;
    } catch {
        console.error('Not access');
    }
}

const rs = fn('/home/romaro/gp/drafts/file-access.jsx').then((path) => path);
console.log(rs);
