import { FastifyReply } from 'fastify';
import { GlobalContext, ActionContext, IRequest } from './types/utils';
import { ActionResult, DataResult, PageResult, BaseAction, ActionConstructor } from './BaseAction';

export abstract class BaseController {
    constructor(public g: GlobalContext) {}

    // TODO типизировать хендлер, который возвращает эшкн раннер. Будет та же сигнатура, что и для Handlers
    actionRunner(actionClass: ActionConstructor) {
        // На момент обработки экшена объект заспроса уже будет расширен до IRequest (см Server)
        return async (req: IRequest, res: FastifyReply): Promise<FastifyReply | void> => {
            const ctx: ActionContext = {
                // TODO add logger warning
                lang: req?.locals?.lang ? req.locals.lang : this.g.config.defaultLang,
            };

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
