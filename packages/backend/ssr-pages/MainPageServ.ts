import { BasePageServ, PageServConstructor } from '../core/BasePageServ';

export class MainPageServ extends BasePageServ {
    httpStatus: HttpStatus;
    constructor(...args: ConstructorParameters<PageServConstructor>) {
        super(...args);
        this.httpStatus = 200;
    }
}
