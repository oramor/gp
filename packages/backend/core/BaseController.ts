import { FastifyRequest, FastifyReply } from 'fastify';
import { ActionResult, IAction, DataResult, PageResult } from './BaseAction';
import { ActionContext, GlobalContext } from './types/utils';

export class BaseController {
    constructor(public g: GlobalContext) {}

    actionRunner(action: IAction) {
        return async (
            req: FastifyRequest,
            res: FastifyReply,
        ): Promise<FastifyReply | void> => {
            const ctx: ActionContext = req;

            try {
                const result = await action.run(this.g, ctx);

                // Set http status code
                res.statusCode = result.httpStatus;

                switch (result.type) {
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
                // ActionError
                console.log(err.message);
            }
        };
    }
}
