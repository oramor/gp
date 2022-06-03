import Handlebars from 'handlebars';
import { readFile, access } from 'node:fs/promises';

export class TemplateService {
    public async render(path: string, placeholders: Placeholders): Promise<string> {
        try {
            // Node access checker
            await access(path);

            // If encoding param passed, readFile returns Buffer
            const template: string = await readFile(path, { encoding: 'utf-8' });

            const compilier: Handlebars.TemplateDelegate<Placeholders> = Handlebars.compile(template);

            return compilier(placeholders);
        } catch (err) {
            // TODO Error handle
            throw err;
        }
    }
}