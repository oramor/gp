import { GlobalContext, ActionContext } from './types/context';

type ActionResultType = 'data' | 'render';

type AbstractActionResult = {
    httpStatus: HttpStatus;
    type: ActionResultType;
}

export type ActionResult<T> = AbstractActionResult & T;

export interface DataResult {
    json: JsonObject;
}

export interface PageResult {
    placeholders: {};
}

export interface IAction {
    run<T extends DataResult | PageResult>(g: GlobalContext, ctx: ActionContext): Promise<ActionResult<T>>;
}

export class BaseAction {
    public static data(obj: JsonObject): ActionResult<DataResult> {
        return {
            type: 'data',
            json: obj,
            httpStatus: 200
        }
    }
}