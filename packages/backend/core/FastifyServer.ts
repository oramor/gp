import fastify, { FastifyInstance, RouteOptions, preHandlerHookHandler } from 'fastify';
import { GlobalContext, IRequest, IRoute } from './types/utils';
import { HandlerConstructor } from './BaseHandler';
import { ControllerConstructor } from './BaseController';

export class FastifyServer {
    private engine: FastifyInstance;
    private preHandlers: preHandlerHookHandler[];

    constructor(private g: GlobalContext) {
        this.engine = fastify({
            logger: true,
        });

        this.preHandlers = [];

        /**
         * Объект любого запроса безусловно расширяется транзитным свойством locals.
         * Оно используется для передачи данных локального контекста
         * между обработчиками. Из этих данных в контроллере формируется
         * контекст экшена (см IRequest, ActionContext, LocalContext)
         */
        this.engine.addHook('onRequest', (req, _res, done) => {
            const actualReq: IRequest = req;
            actualReq.locals = {};
            done();
        });
    }

    private setRoute(obj: RouteOptions) {
        this.engine.route(obj);
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

    public setControllers(arr: ControllerConstructor[]) {
        arr.forEach((controllerClass) => {
            const inst = new controllerClass(this.g);

            inst.routes.forEach((router: IRoute) => {
                this.setRoute({
                    method: router.method,
                    url: router.url,
                    preHandler: this.preHandlers,
                    handler: router.handler,
                });
            });
        });
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
