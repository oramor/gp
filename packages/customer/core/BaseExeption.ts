import { GlobalContext, ActionContext } from './types/utils';

export type ExceptionConstructor<T> = new (
    g: GlobalContext,
    ctx: ActionContext,
    dto?: T,
) => BaseExeption<T>;

export abstract class BaseExeption<T extends InvalidFormDTO> {
    abstract handle(): void;
    protected g: GlobalContext;
    protected ctx: ActionContext;
    protected dto: T;
    constructor(...args: ConstructorParameters<ExceptionConstructor<T>>) {
        this.g = args[0];
        this.ctx = args[1];
        this.dto = args[2] as T;
    }
}
