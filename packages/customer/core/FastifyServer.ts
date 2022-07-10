import * as Fastify from 'fastify';
import { fastify } from 'fastify';
import { GlobalContext, IRequest } from './types/utils';
import { HandlerConstructor } from './BaseHandler';
import { ControllerConstructor } from './BaseController';
import { FastifyHandlers, FastifyObjects } from './types/libs/fastify';
import { LangHandler } from './defaults/handlers/LangHandler';
import { NotFoundHandler } from './defaults/handlers/NotFoundHandler';

export class FastifyServer {
    private engine: Fastify.FastifyInstance;
    private preHandlers: FastifyHandlers.PreHandler[];

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

        /**
         * TODO Здесь жестко прописаны обработчики ошибки не найденного роута
         * Причем приходится добавлять сюда такой же прехендлер для определения
         * языка, который добавлять в роуты.
         */
        this.engine.setNotFoundHandler(
            {
                preHandler: new LangHandler(this.g).handler,
            },
            new NotFoundHandler(this.g).handler,
        );

        /**
         * Регистрация финального обработчика ошибок
         */
        //this.engine.setErrorHandler()
    }

    private setRoute(obj: Fastify.RouteOptions) {
        this.engine.route(obj);
    }

    public start() {
        const port = this.g.config.port;
        /**
         * Option { host: '0.0.0.0' } is very important for Docker deploying
         * See https://www.fastify.io/docs/latest/Reference/Server/#listen
         */
        const host = this.g.config.host;
        this.engine.listen({ port, host }, (err) => {
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
            this.preHandlers.push(inst.handler.bind(this.engine));
        });
    }

    public setControllers(arr: ControllerConstructor[]) {
        arr.forEach((controllerClass) => {
            const inst = new controllerClass(this.g);

            inst.routes.forEach((router: FastifyObjects.IRouteOptions) => {
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
            console.error(err);
            process.exit(1);
        }
    }
}
