import { BaseExeption, ExceptionConstructor } from '../BaseExeption';

export class FormException extends BaseExeption<InvalidFormDTO> {
    constructor(...args: ConstructorParameters<ExceptionConstructor<InvalidFormDTO>>) {
        super(...args);
    }

    handle() {
        const sendAction = this.ctx.res.send;
        const dto = this.dto;
        sendAction(dto);
    }
}
