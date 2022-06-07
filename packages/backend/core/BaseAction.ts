import { GlobalContext, ActionContext } from './types/utils';
import { BasePageServ } from './BasePageServ';

type ActionResultCode = 'data' | 'render';

type AbstractActionResult = {
    resultCode: ActionResultCode;
    httpStatus: HttpStatus;
};

export interface DataResult {
    json: JsonObject;
}

export interface PageResult {
    htmlPromise: Promise<string>;
}

export type ActionResult<T> = AbstractActionResult & T;

export type ActionClassConstructor = new (g: GlobalContext, ctx: ActionContext) => BaseAction;

export abstract class BaseAction {
    abstract run(): Promise<ActionResult<DataResult | PageResult>>;
    protected g: GlobalContext;
    protected ctx: ActionContext;
    constructor(...args: ConstructorParameters<ActionClassConstructor>) {
        this.g = args[0];
        this.ctx = args[1];
    }

    public data(obj: JsonObject): ActionResult<DataResult> {
        return {
            resultCode: 'data',
            httpStatus: 200,
            json: obj,
        };
    }

    public render(pageServInst: BasePageServ): ActionResult<PageResult> {
        return {
            resultCode: 'render',
            httpStatus: pageServInst.httpStatus,
            htmlPromise: pageServInst.render(),
        };
    }
}
