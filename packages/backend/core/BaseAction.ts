import { GlobalContext, ActionContext } from './types/utils';
import { PageInstance } from './BasePage';

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
    htmlPromise: Promise<string>;
}

export interface IAction {
    run<T extends DataResult | PageResult>(g: GlobalContext, ctx: ActionContext): Promise<ActionResult<T>>;
}

export class BaseAction {
    public static data(obj: JsonObject): ActionResult<DataResult> {
        return {
            type: 'data',
            httpStatus: 200,
            json: obj
        }
    }

    public static render(page: PageInstance): ActionResult<PageResult> {
        return {
            type: 'render',
            httpStatus: page.httpStatus,
            htmlPromise: page.render()
        }
    }
}