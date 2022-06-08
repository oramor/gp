import { BaseHandler, HandlerConstructor, PreHandler } from '../core/BaseHandler';
import { HandlerDoneFunc, IRequest, IResponse } from '../core/types/utils';

export class LangHandler extends BaseHandler<PreHandler> {
    constructor(...args: ConstructorParameters<HandlerConstructor>) {
        super(...args);
    }

    getHandler(): PreHandler {
        return (req: IRequest, _res: IResponse, done: HandlerDoneFunc) => {
            if (req.locals) {
                // TODO getting language
                req.locals['lang'] = 'ru';
                done();
            }
            done(
                new Error(
                    'Not found Req.locals. It should be set in the class which extends from Server',
                ),
            );
        };
    }
}
