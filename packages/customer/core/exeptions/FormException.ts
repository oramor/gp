import { BaseExeption, ExceptionConstructor } from '../BaseExeption';

export class FormException extends BaseExeption<InvalidFormDTO> {
    constructor(...args: ConstructorParameters<ExceptionConstructor<InvalidFormDTO>>) {
        super(...args);
    }

    handle() {
        console.log('form exep------------', this.dto);
        const res = this.ctx.res;
        const errors = this.dto;
        const obj: ActionResult<DataResult<InvalidFormDTO>> = {
            resultCode: 'invalidForm',
            httpStatus: 404,
            dto: {
                topError: errors.topError || '',
                fields: errors.fields || [],
            },
        };
        res.statusCode = 404;
        return res.send(obj);
    }
}
