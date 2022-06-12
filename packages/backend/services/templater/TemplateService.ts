import Handlebars from 'handlebars';
import { readFile, access } from 'node:fs/promises';

export class TemplateService {
    public async render(path: string, obj: PlaceholdersObject): Promise<string> {
        // Node access checker
        await access(path);

        // If encoding param passed, readFile returns Buffer
        const template: string = await readFile(path, { encoding: 'utf-8' });

        const compilier: Handlebars.TemplateDelegate<PlaceholdersObject> =
            Handlebars.compile(template);

        return compilier(obj);
    }
}
