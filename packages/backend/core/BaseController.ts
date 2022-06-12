import {
    GlobalContext,
    ActionContext,
    IRequest,
    IResponse,
    HandlerFunc,
    IRoute,
} from './types/utils';
import { ActionResult, DataResult, PageResult, BaseAction, ActionConstructor } from './BaseAction';
import { BaseUri } from './BaseUri';
import { ActionError } from './errors/ActionError';
import { BaseExeption } from './BaseExeption';
import { HttpError } from './errors/HttpError';

export type ControllerConstructor = new (g: GlobalContext) => BaseController<BaseUri>;

export abstract class BaseController<T extends BaseUri> {
    abstract urls: T;
    protected g: GlobalContext;
    public routes: IRoute[];
    constructor(...args: ConstructorParameters<ControllerConstructor>) {
        this.g = args[0];
    }

    private parseMethod(str: string | undefined): HttpMethods | null {
        if (!str) return null;

        switch (true) {
            case /GET/.test(str):
                return 'GET';
            case /POST/.test(str):
                return 'POST';
            case /PUT/.test(str):
                return 'PUT';
            case /DELETE/.test(str):
                return 'DELETE';
            case /HEAD/.test(str):
                return 'HEAD';
            case /PATCH/.test(str):
                return 'PATCH';
            case /OPTIONS/.test(str):
                return 'OPTIONS';
            default:
                return null;
        }
    }

    /**
     * Идея данного API в том, что каждому ресурсу (uri) может
     * соответствовать один или несколько экшенов, которые привязываются
     * к HTTP-методу. При этом http-метод указывается в названии
     * экшен-класса (например, IndexGET)
     */
    protected setRoute(uri: string, actions: ActionConstructor[]) {
        actions.forEach((actionClass: ActionConstructor) => {
            const method = this.parseMethod(actionClass.name);

            if (!method) {
                throw Error(`AppError: Action class have a wrong name. 
                It should contain uppercase method name (like IndesGET)`);
            }

            const routeDeclaration: IRoute = {
                method,
                url: uri,
                handler: this.actionRunner(actionClass),
            };

            this.routes.push(routeDeclaration);
        });
    }

    /**
     * Данный метод возвращает функцию, которая регистрируется в качестве
     * финального обработчика запроса. По сути, этот метод предоставляет
     * замыкание на глобальный контекст.
     */
    actionRunner(actionClass: ActionConstructor): HandlerFunc {
        // На момент обработки экшена объект запроса уже будет расширен до IRequest (см Server)
        return async (req: IRequest, res: IResponse): Promise<IResponse | void> => {
            const method = this.parseMethod(req.raw.method);
            if (!method) {
                throw new HttpError(res, 400, 'Not found mehod in the request headers');
            }

            const ctx: ActionContext = {
                method,
                // TODO add logger warning
                lang: req?.locals?.lang ? req.locals.lang : this.g.config.defaultLang,
                req,
                res,
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
                        throw Error(`Unhandled action method [ ${result.resultCode} ]`);
                }
            } catch (exep) {
                if (exep instanceof BaseExeption) {
                    return exep.handle();
                }

                if (exep instanceof ActionError) {
                    return exep.handle();
                }

                if (exep instanceof HttpError) {
                    return exep.handle();
                }

                // To put in a standard handler https://www.fastify.io/docs/latest/Reference/Server/#seterrorhandler
                if (exep instanceof Error) {
                    exep.message = exep.message
                        ? `Unhandled error: ${exep.message}`
                        : 'Unhandled error';
                    throw exep;
                }

                throw Error('Unknown exeption');
            }
        };
    }
}
