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
import { ServiceError } from './ServiceError';
import { BaseExeption } from './BaseExeption';

export type ControllerConstructor = new (g: GlobalContext) => BaseController<BaseUri>;

export abstract class BaseController<T extends BaseUri> {
    abstract urls: T;
    protected g: GlobalContext;
    public routes: IRoute[];
    constructor(...args: ConstructorParameters<ControllerConstructor>) {
        this.g = args[0];
    }

    private parseMethod(actionClass: ActionConstructor): HttpMethods | null {
        const className = actionClass.name;

        switch (true) {
            case /GET/.test(className):
                return 'GET';
            case /POST/.test(className):
                return 'POST';
            case /PUT/.test(className):
                return 'PUT';
            case /DELETE/.test(className):
                return 'DELETE';
            case /HEAD/.test(className):
                return 'HEAD';
            case /PATCH/.test(className):
                return 'PATCH';
            case /OPTIONS/.test(className):
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
            const method = this.parseMethod(actionClass);

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
            const ctx: ActionContext = {
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
                        throw Error('AppError: Unhandler response');
                }
            } catch (exep) {
                if (exep instanceof BaseExeption) {
                    console.log('BaseExeption');
                }

                if (exep instanceof ServiceError) {
                    console.log('Service error');
                }

                Error('Unknown error');
            }
        };
    }
}
