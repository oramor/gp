import { BaseAction, ActionConstructor } from '../../../core/BaseAction';
import { ActionContextForm } from '../../../core/types/utils';
import { LoginFormServ } from '../forms/LoginForm/LoginFormServ';
import { LoginFormFields } from '../forms/LoginForm/LoginFormSchema';

export class LoginPOST extends BaseAction {
    constructor(...args: ConstructorParameters<ActionConstructor>) {
        super(...args);
    }
    async run() {
        const form = new LoginFormServ(this.g, this.ctx as ActionContextForm<LoginFormFields>);
        console.log('Action ------------------------------');
        console.log(form.fields.email);
        console.log(form.fields.password);

        return this.data({ ...form.fields });
    }
}
