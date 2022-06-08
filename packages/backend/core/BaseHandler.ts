import { GlobalContext, IRequest, IResponse, HandlerDoneFunc } from './types/utils';
import { FastifyInstance } from 'fastify';

export type HandlerConstructor = new (g: GlobalContext) => BaseHandler;

export type PreHandler = (
    this: FastifyInstance,
    req: IRequest,
    res: IResponse,
    done: HandlerDoneFunc,
) => void;

export abstract class BaseHandler<T = PreHandler> {
    abstract getHandler(): T;
    g: GlobalContext;
    constructor(...args: ConstructorParameters<HandlerConstructor>) {
        this.g = args[0];
    }
}
