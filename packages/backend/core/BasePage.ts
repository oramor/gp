import { GlobalContext } from './types/context';

export interface PageInstance extends BasePage {
    httpStatus: HttpStatus;
}

export class BasePage {
    protected templateDir: string;
    private templater;

    constructor(private g: GlobalContext) {
        this.templateDir = this.g.config.templateDir;
        this.templater = this.g.templater;
    }

    public async render(): Promise<string> {
        try {
            return await this.templater.render(this.templatePath, this.placeholders);
        } catch (err) {
            // Todo: mark PageError?
            throw err;
        }
    }

    private get placeholders(): Placeholders {
        // Todo
        return {};
    }

    private get pageName(): string {
        return this.constructor.name;
    }

    private get templatePath(): string {
        return this.templateDir + '/' + this.pageName + '.html';
    }
}