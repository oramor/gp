import { ActionContext, GlobalContext } from './types/utils';

export type BaseBlockServConstructor = new (
    g: GlobalContext,
    ctx: ActionContext,
    props?: PlaceholdersNode,
) => BaseBlockServ;

export abstract class BaseBlockServ {
    /**
     * TODO: Or it will return renderFunction() ref (for React conponents) or getPlaceholders() for non-rendering
     */
    abstract init(): Promise<PlaceholdersObject> | PlaceholdersObject;
    declare dict: DictionaryObject;
    protected g: GlobalContext;
    protected ctx: ActionContext;
    protected props?: PlaceholdersNode;

    /**
     * This is the same object as the BasePageServ.propsPlaceholders
     */
    private propsPlaceholders: PlaceholdersNode;

    /**
     * Early known as data/selfdata/static/own
     */
    private selfPlaceholders: PlaceholdersNode;

    constructor(...args: ConstructorParameters<BaseBlockServConstructor>) {
        this.g = args[0];
        this.ctx = args[1];

        // Placeholdes root nodes
        this.propsPlaceholders = args[2] ?? {};
        this.selfPlaceholders = {};
    }

    /**
     * Protected, because external code should use init() for get palceholders
     */
    protected get placeholders(): PlaceholdersObject {
        return {
            props: this.propsPlaceholders,
            self: this.selfPlaceholders,
        };
    }
}
