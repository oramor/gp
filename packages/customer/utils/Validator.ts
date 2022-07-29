import { AbstractValidator } from '../core/AbstractValidator';

export class Validator extends AbstractValidator {
    public validatorFactory(type: Validators) {
        switch (type) {
            case 'email':
                return this.isEmail;
            case 'password':
                return this.isPassword;
            default:
                throw Error(`Not found validator with type ${type}`);
        }
    }

    private isEmail(v: string) {
        const regex = /^(.+)@(\S+)$/;
        return regex.test(v);
    }

    private isPassword(v: string) {
        console.log('pass-----------', v);
        return v.length > 2 ? true : false;
    }
}
