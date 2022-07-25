import { AbstractValidator } from '../core/AbstractValidator';

export class Validator extends AbstractValidator {
    public validatorFactory(type: Validators) {
        switch (type) {
            case 'string':
                return this.isString;
            default:
                throw Error(`Not found validator with type ${type}`);
        }
    }

    private isString(v: any) {
        if (typeof v === 'string') return true;
        return false;
    }
}
