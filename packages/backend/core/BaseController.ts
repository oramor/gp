import {
    GlobalContext,
    ActionContext,
    IRequest,
    IResponse,
    HandlerFunc,
    IRoute,
} from './types/utils';
import { ActionResult, DataResult, PageResult, BaseAction, ActionConstructor } from './BaseAction';
import { BaseUri, UriConstructor } from './BaseUri';

export type ControllerConstructor = new (g: GlobalContext) => BaseController;

export abstract class BaseController {
    protected g: GlobalContext;
    private _urls: BaseUri;
    public routes: IRoute[];
    constructor(...args: ConstructorParameters<ControllerConstructor>) {
        this.g = args[0];
    }

    protected setUrls(uriClass: UriConstructor) {
        const inst = new uriClass(this.g);
        this._urls = inst;
    }

    protected get urls() {
        return this._urls;
    }

    /**
     * Идея данного API в том, что каждому ресурсу (uri) может
     * соответствовать один или несколько экшенов, которые привязываются
     * к HTTP-методу
     */
    setRoute(uri: string, arr: ActionConstructor[]) {
        arr.forEach((actionClass: ActionConstructor) => {
            const routeDeclaration: IRoute = {
                //! TODO calculate method from action class name
                method: 'GET',
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
                        throw new Error('AppError: Unhandler response');
                }
            } catch (err) {
                // TODO ActionError
                console.log(err.message);
            }
        };
    }
}
