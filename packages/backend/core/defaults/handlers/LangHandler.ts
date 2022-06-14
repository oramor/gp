import { BaseHandler, HandlerConstructor } from '../../BaseHandler';
import { FastifyObjects, FastifyHandlers } from '../../types/libs/fastify';
import { IRequest } from '../../types/utils';

export class LangHandler extends BaseHandler<FastifyHandlers.PreHandler> {
    constructor(...args: ConstructorParameters<HandlerConstructor>) {
        super(...args);
    }

    get handler(): FastifyHandlers.PreHandler {
        return (req: IRequest, _res: FastifyObjects.IRes, done: FastifyHandlers.HandlerDone) => {
            if ('locals' in req) {
                // TODO getting language from cookies
                req.locals['lang'] = 'ru';
                done();
            } else {
                done(
                    new Error(`Not found Req.locals. It should be set in
                        the class which extends from Server`),
                );
            }
        };
    }
}
