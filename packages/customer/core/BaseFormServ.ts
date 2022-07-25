import { ActionContext, GlobalContext } from './types/utils';

type FormConstructor = new (g: GlobalContext, ctx: ActionContext) => BaseFormServ<FormSchemaFields>;

export abstract class BaseFormServ<Fields extends string> {
    abstract schema: FormSchema<Fields>;
    protected g: GlobalContext;
    protected ctx: ActionContext;
    constructor(...args: ConstructorParameters<FormConstructor>) {
        this.g = args[0];
        this.ctx = args[1];
    }
}
