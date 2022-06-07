import { ActionContext, GlobalContext } from './types/utils';

export type PageServConstructor = new (
    g: GlobalContext,
    ctx: ActionContext,
    props?: PlaceholdersNode,
) => BasePageServ;

export abstract class BasePageServ {
    abstract httpStatus: HttpStatus;
    protected templatesDirAbsolutePath: string;
    private templateService;

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
        private props?: PlaceholdersNode,
    ) {
        this.templatesDirAbsolutePath = this.g.config.templateDir;
        this.templateService = this.g.templater;
        this.propsPlaceholders = this.props ?? {};
        this.staticPlaceholders = {};
    }

    public render(): Promise<string> {
        return this.templateService.render(this.templatePath, this.placeholders);
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
        return this.templatesDirAbsolutePath + '/' + this.pageName + '.html';
    }
}
