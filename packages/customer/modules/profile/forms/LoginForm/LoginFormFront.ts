import { BaseFormFront } from '../../../../core/BaseFormFront';
import { LoginFormSchema } from './LoginFormSchema';

export class LoginFormFront extends BaseFormFront {
    _login: FormField = {
        ...LoginFormSchema['login'],
        value: '',
        error: '',
    };

    _password: FormField = {
        ...LoginFormSchema['password'],
        value: '',
        error: '',
    };

    constructor(lang: SupportedLangs) {
        super(lang);
        this.makeObservableWrapper();
    }

    get login() {
        return this._login;
    }

    get password() {
        return this._password;
    }
}
