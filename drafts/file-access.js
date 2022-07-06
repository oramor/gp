import { access } from 'node:fs/promises';

try {
    await access('/home/romaro/gp/drafts/file-access.jsx');
    console.log('Can access');
} catch {
    console.error('Not access');
}
