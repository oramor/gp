import fastify, { FastifyInstance, RouteOptions, preHandlerHookHandler } from "fastify";

export class FastifyServer {
    engine: FastifyInstance;
    preHandlers: preHandlerHookHandler[];

    constructor() {
        this.engine = fastify({
            logger: true
        });

        this.preHandlers = [];
    }

    public listen(port: number) {
        this.engine.listen({ port }, (err) => {
            if (err) throw err
        });
    }

    public addSessionMiddleware(cls) {
        this.preHandlers.push(cls.getHandler());
    }

    public addFaviconMiddleware() { };

    public addControllers(arr: Array<any>) {
        arr.forEach(controller => {
            const routes = controller.routes;

            routes.forEach(router => {
                this.addRoute({
                    method: router.method,
                    url: router.url,
                    preHandler: this.preHandlers,
                    handler: router.handler
                });
            }
            )
        })
    }

    private addRoute(obj: RouteOptions) {
        this.engine.route(obj);
    }
}