export class Validator {
    public validatorFactory(type: Validators): ValidatorFunction | void {
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
