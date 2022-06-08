import fastify, { FastifyInstance, RouteOptions, preHandlerHookHandler } from 'fastify';
import { GlobalContext, IRequest } from './types/utils';
import { HandlerConstructor } from './BaseHandler';

export class FastifyServer {
    private engine: FastifyInstance;
    private preHandlers: preHandlerHookHandler[];

    constructor(private g: GlobalContext) {
        this.engine = fastify({
            logger: true,
        });

        this.preHandlers = [];

        /**
         * Добавляем заготовку для локального контекста, из которого
         * впоследствии будет формироваться контекст экшена. Это соответствует
         * интерфейсу IRequest.
         */
        this.engine.addHook('onRequest', (req, _res, done) => {
            const actualReq: IRequest = req;
            actualReq.locals = {};
            done();
        });
    }

    public start() {
        this.engine.listen({ port: this.g.config.port }, (err) => {
            if (err) throw err;
        });
    }

    public setPreHandlers(arr: HandlerConstructor[]) {
        arr.forEach((handlerClass: HandlerConstructor) => {
            const inst = new handlerClass(this.g);

            /**
             * Сигнатура preHandlerHookHandler (параметр this) явно указывает,
             * что хендлер должен вызываться в контексте инстанса сервера
             * (иначе функция хендлера просто не получит доступ к объектам
             * Response, Reply и т.д.)
             */
            this.preHandlers.push(inst.getHandler().bind(this.engine));
        });
    }

    public setControllers(arr: Array<any>) {
        arr.forEach((controller) => {
            const routes = controller.routes;

            routes.forEach((router: any) => {
                this.setRoute({
                    method: router.method,
                    url: router.url,
                    preHandler: this.preHandlers,
                    handler: router.handler,
                });
            });
        });
    }

    private setRoute(obj: RouteOptions) {
        this.engine.route(obj);
    }

    public async shutdown(code: ShutdownCode) {
        console.log(`Terminating with code: ${code}`);
        try {
            process.exit(0);
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    }
}
