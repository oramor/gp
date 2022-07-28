import { BaseFormServ, BaseFormConstructor } from '../../../../core/BaseFormServ';
import { LoginFormSchema, LoginFormFields, LoginFormFieldsServ } from './LoginFormSchema';

export class LoginFormServ extends BaseFormServ<LoginFormFields, LoginFormFieldsServ> {
    public schema = LoginFormSchema;
    constructor(...args: ConstructorParameters<BaseFormConstructor>) {
        super(...args);
    }
}
