import { FastifyRequest, FastifyReply } from 'fastify';
import { GlobalContext, ActionContext } from './types/utils';
import {
    ActionResult,
    DataResult,
    PageResult,
    BaseAction,
    ActionClassConstructor,
} from './BaseAction';

export abstract class BaseController {
    constructor(public g: GlobalContext) {}

    actionRunner(actionClass: ActionClassConstructor) {
        return async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply | void> => {
            const ctx: ActionContext = req;
            try {
                const actionInst: BaseAction = new actionClass(this.g, ctx);
                const result = await actionInst.run();

                // Set http status code
                res.statusCode = result.httpStatus;

                switch (result.resultCode) {
                    case 'data': {
                        const rs = result as ActionResult<DataResult>;
                        return res.send(rs.json);
                    }
                    case 'render': {
                        const rs = result as ActionResult<PageResult>;
                        return res.send(await rs.htmlPromise);
                    }
                    default:
                        throw new Error('AppError: Unhandler response');
                }
            } catch (err) {
                // TODO ActionError
                console.log(err.message);
            }
        };
    }
}
