import { GlobalContext, ActionContext } from './types/utils';

export type ExceptionConstructor = new (g: GlobalContext, ctx: ActionContext) => BaseExeption;

export abstract class BaseExeption {
    protected g: GlobalContext;
    protected ctx: ActionContext;
    constructor(...args: ConstructorParameters<ExceptionConstructor>) {
        this.g = args[0];
        this.ctx = args[1];
    }
}
