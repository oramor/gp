import { BaseHandler, HandlerConstructor } from '../../BaseHandler';
import { FastifyHandlers, FastifyObjects } from '../../types/libs/fastify';

export class NotFoundHandler extends BaseHandler<FastifyHandlers.RouteHandler> {
    constructor(...args: ConstructorParameters<HandlerConstructor>) {
        super(...args);
    }

    get handler(): FastifyHandlers.RouteHandler {
        return (_req: FastifyObjects.IReq, res: FastifyObjects.IRes) => {
            res.status(404).send();
        };
    }
}
