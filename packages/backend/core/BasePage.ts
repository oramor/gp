import Handlebars from 'handlebars';
import { readFile } from 'node:fs/promises';

interface TemplatePlaceholders {
    [key: string]: string | number
}

export class BasePage {
    private newTemplate(source: string): HandlebarsTemplateDelegate {
        return Handlebars.compile(source)
    }

    protected async render(path: string, placeholders: TemplatePlaceholders) {
        try {
            // If you passed encoding, readFile returns Buffer
            const source = await readFile(path, { encoding: 'utf-8' });

            return this.newTemplate(source)
                .call(null, placeholders);
        } catch (err) {
            console.log(err.message);
        }
    }
}