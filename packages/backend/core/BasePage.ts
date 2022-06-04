import { ActionContext, GlobalContext } from './types/utils';

export interface PageInstance extends BasePage {
    httpStatus: HttpStatus;
}

export class BasePage {
    protected templateDir: string;
    private templater;

    /**
     * Плейсхолдеры уровня страницы, которые доступны в шаблонизаторе
     * по ссылкам вида props.placeholderName. Могут быть переданы в props
     * при инициализации страницы, либо через вызов метода setPlaceholder()
     */
    private propsPlaceholders: Placeholders;

    /**
     * В отличие от propsPlaceholders, эти плейсхолдеры явно прописываются
     * в классе страницы. Это максимально статичные данные.
     */
    private staticPlaceholders: Placeholders;

    constructor(
        private g: GlobalContext, private ctx: ActionContext, private props: Placeholders = {}) {
        this.templateDir = this.g.config.templateDir;
        this.templater = this.g.templater;
        this.propsPlaceholders = this.props;
        this.staticPlaceholders = {};
    }

    public async render(): Promise<string> {
        try {
            return await this.templater.render(this.templatePath, this.placeholders);
        } catch (err) {
            // Todo: mark PageError?
            throw err;
        }
    }

    public setPlaceholder(name: string, value: PlaceholderValue): void {
        this.propsPlaceholders[name] = value;
    }

    private checkRootName(name: string): void {
        const reservedNames = ['user', 'static', 'page', 'props'];

        if (reservedNames.includes(name)) {
            throw new Error(`Root name [ ${name} ] is reserved`);
        }
    }

    /**
     * Объект шаблонизации
     * На первом уровне вложенности должны находиться только объекты.
     * Причем каждый из таких объектов группирует плейсхолдеры по источнику данных.
     * Например, в dict.sendButtonName сразу понятно, что плейсхолдер
     * sendButtonName был инициализирован в словаре самой странице.
     * А в случае с BlockName.dict.sendButtonName уже в словаре
     * подключенного к странице компонента BlockName.
     */
    private get placeholders(): Placeholders {
        return {
            static: this.staticPlaceholders,
            props: this.propsPlaceholders
        };
    }

    private get pageName(): string {
        return this.constructor.name;
    }

    private get templatePath(): string {
        return this.templateDir + '/' + this.pageName + '.html';
    }
}