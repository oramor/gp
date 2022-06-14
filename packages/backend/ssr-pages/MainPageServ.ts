import { BasePageServ, PageServConstructor } from '../core/BasePageServ';

export class MainPageServ extends BasePageServ {
    httpStatus: HttpStatus = 200;
    dictionary: DictionaryObject = {
        hello: {
            ru: 'Главпоставка',
            en: 'Glavpostavka',
        },
    };
    constructor(...args: ConstructorParameters<PageServConstructor>) {
        super(...args);
    }
}
