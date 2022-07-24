import { BaseFormFront } from '../../../../core/BaseFormFront';
import { LoginFormSchema, LoginFormFields } from './LoginFormSchema';

export class LoginFormFront extends BaseFormFront {
    _login: FormFieldSchema = {
        ...LoginFormSchema['login'],
        value: '',
        error: '',
    };

    _password: FormFieldSchema = {
        ...LoginFormSchema['password'],
        value: '',
        error: '',
    };

    constructor(lang: SupportedLangs) {
        super(lang);
        this.makeObservableWrapper();
    }

    get login() {
        return this.computeField<LoginFormFields>(this._login, 'login');
    }

    get password() {
        return this.computeField<LoginFormFields>(this._password, 'password');
    }
}
