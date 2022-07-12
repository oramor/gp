import { ActionContext, GlobalContext } from './types/utils';
import { ActionError } from './errors/ActionError';

export type PageServConstructor = new (
    g: GlobalContext,
    ctx: ActionContext,
    props?: PlaceholdersNode,
) => BasePageServ;

export abstract class BasePageServ {
    abstract httpStatus: HttpStatus;
    abstract dictionary: DictionaryObject;
    protected g: GlobalContext;
    protected ctx: ActionContext;
    protected props?: PlaceholdersNode;
    protected templatesDirAbsolutePath: string;

    //TODO this is an external dependency for core. Maybe implement BaseServer.setTemplateService?
    // or do this as a config required?
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
    private selfPlaceholders: PlaceholdersNode;

    constructor(...args: ConstructorParameters<PageServConstructor>) {
        this.g = args[0];
        this.ctx = args[1];

        // Placeholdes root nodes
        this.propsPlaceholders = args[2] ?? {};
        this.selfPlaceholders = {};

        this.templatesDirAbsolutePath = this.g.config.templateDir;
        this.templateService = this.g.templater;
    }

    public async render(): Promise<string> {
        try {
            const result = await this.templateService.render(this.templatePath, this.placeholders);
            return result;
        } catch (err) {
            throw new ActionError(this.ctx, 'Template service error');
        }
    }

    public setPlaceholder(name: string, value: PlaceholderValue): void {
        this.propsPlaceholders[name] = value;
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
    private get placeholders(): PlaceholdersObject {
        return {
            props: this.propsPlaceholders,
            self: this.selfPlaceholders,
        };
    }

    private get pageName(): string {
        return this.constructor.name;
    }

    private get templatePath(): string {
        return this.templatesDirAbsolutePath + '/' + this.pageName + '.html';
    }
}
