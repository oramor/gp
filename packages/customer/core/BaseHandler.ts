import { GlobalContext } from './types/utils';
import { FastifyHandlers } from './types/libs/fastify';

export type HandlerConstructor = new (g: GlobalContext) => BaseHandler;

export abstract class BaseHandler<T = FastifyHandlers.PreHandler | FastifyHandlers.RouteHandler> {
    abstract get handler(): T;
    g: GlobalContext;
    constructor(...args: ConstructorParameters<HandlerConstructor>) {
        this.g = args[0];
    }
}
