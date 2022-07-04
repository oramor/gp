import { BasePageServ, PageServConstructor } from '../../../../core/BasePageServ';

export class MainPageServ extends BasePageServ {
    httpStatus: HttpStatus = 200;
    dictionary: DictionaryObject = {
        title: {
            ru: 'Главпоставка',
            en: 'Glavpostavka',
        },
        slogan: {
            ru: 'Больше, чем фулфилмент',
            en: 'More then fillfilment',
        },
    };
    constructor(...args: ConstructorParameters<PageServConstructor>) {
        super(...args);
    }
}
