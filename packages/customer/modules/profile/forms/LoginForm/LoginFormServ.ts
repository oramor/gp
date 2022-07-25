import { BaseFormServ } from '../../../../core/BaseFormServ';
import { LoginFormSchema, LoginFormFields } from './LoginFormSchema';

export class LoginFormServ extends BaseFormServ<LoginFormFields> {
    public schema = LoginFormSchema;
}
