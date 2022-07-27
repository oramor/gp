import { BaseExeption, ExceptionConstructor } from '../BaseExeption';

export class FormException extends BaseExeption {
    constructor(...args: ConstructorParameters<ExceptionConstructor>) {
        super(...args);
    }

    handle() {
        const sendAction = this.ctx.res.send;
    }
}
