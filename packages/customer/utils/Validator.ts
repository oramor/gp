import { AbstractValidator, ValidatorDelegate } from '../core/AbstractValidator';

export type Validators = 'string' | 'email' | 'phone' | 'password';

export class Validator extends AbstractValidator<Validators> {
    public validatorFactory(type: Validators): ValidatorDelegate | void {
        switch (type) {
            case 'string':
                return this.isString;
            default:
                Error(`Not found validator with type ${type}`);
        }
    }

    private isString(v: any) {
        if (typeof v === 'string') return true;
        return false;
    }
}