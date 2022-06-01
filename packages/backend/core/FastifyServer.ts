import fastify, { FastifyInstance, RouteOptions, preHandlerHookHandler } from "fastify";

export class FastifyServer {
    private engine: FastifyInstance;
    private preHandlers: preHandlerHookHandler[];

    constructor(private g: GlobalContext) {
        this.engine = fastify({
            logger: true
        });

        this.preHandlers = [];
    }

    public start() {
        this.engine.listen({ port: this.g.config.port }, (err) => {
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

    public async shutdown(code: ShutdownCode) {
        console.log(`Terminating with code: ${code}`)
        try {
            process.exit(0);
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    }
}