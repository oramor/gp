import { BaseFormFront } from '../../../../core/BaseFormFront';
import { LoginFormSchema, LoginFormFields } from './LoginFormSchema';
import { profileURI } from '../../ProfileStatic';

export class LoginFormFront extends BaseFormFront {
    apiURI: string = profileURI.login;
    _login: FormFieldState = {
        ...LoginFormSchema['login'],
        value: '',
        error: '',
    };

    _password: FormFieldState = {
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
