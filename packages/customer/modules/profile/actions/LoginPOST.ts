import { BaseAction, ActionConstructor } from '../../../core/BaseAction';
import { LoginFormServ } from '../forms/LoginForm/LoginFormServ';

export class LoginPOST extends BaseAction {
    constructor(...args: ConstructorParameters<ActionConstructor>) {
        super(...args);
    }
    async run() {
        const form = await new LoginFormServ(this.g, this.ctx).init();
        console.log('Action --------------------');
        console.log(form.fields.email);
        console.log(form.fields.password);

        return this.data({ ...form.fields });
    }
}
