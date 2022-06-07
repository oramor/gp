import { BasePageServ, PageServConstructor } from '../core/BasePageServ';

export class MainPageServ extends BasePageServ {
    httpStatus: HttpStatus;
    dictionary: DictionaryObject;
    constructor(...args: ConstructorParameters<PageServConstructor>) {
        super(...args);
        this.httpStatus = 200;
        this.dictionary = {
            hello: {
                ru: 'Главпоставка',
                en: 'Glavpostavka',
            },
        };
    }
}
