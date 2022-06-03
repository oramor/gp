import { ActionContext, GlobalContext } from './types/utils';

export interface IConcretePageServ extends BasePageServ {
    httpStatus: HttpStatus;
}

export class BasePageServ {
    declare httpStatus: HttpStatus;
    protected templateDir: string;
    private templater;

    /**
     * Плейсхолдеры уровня страницы, которые доступны в шаблонизаторе
     * по ссылкам вида props.placeholderName. Могут быть переданы в props
     * при инициализации страницы, либо через вызов метода setPlaceholder()
     */
    private propsPlaceholders: PlaceholdersNode;

    /**
     * В отличие от propsPlaceholders, эти плейсхолдеры явно прописываются
     * в классе страницы. Это максимально статичные данные.
     */
    private staticPlaceholders: PlaceholdersNode;

    constructor(
        private g: GlobalContext,
        private ctx: ActionContext,
        private props: PlaceholdersNode = {},
    ) {
        this.templateDir = this.g.config.templateDir;
        this.templater = this.g.templater;
        this.propsPlaceholders = this.props;
        this.staticPlaceholders = {};
    }

    public render(): Promise<string> {
        return this.templater.render(this.templatePath, this.placeholders);
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
     * Объект плейсхолдеров (ObjectPlaceholders)
     * На первом уровне вложенности должны находиться только объекты.
     * Причем каждый из таких объектов группирует плейсхолдеры по источнику данных.
     * Например, в dict.sendButtonName сразу понятно, что плейсхолдер
     * sendButtonName был инициализирован в словаре самой странице.
     * А в случае с BlockName.dict.sendButtonName уже в словаре
     * подключенного к странице компонента BlockName.
     */
    private get placeholders(): ObjectPlaceholders {
        return {
            static: this.staticPlaceholders,
            props: this.propsPlaceholders,
        };
    }

    private get pageName(): string {
        return this.constructor.name;
    }

    private get templatePath(): string {
        return this.templateDir + '/' + this.pageName + '.html';
    }
}
