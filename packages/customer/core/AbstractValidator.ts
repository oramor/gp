export type ValidatorDelegate = (v: any) => boolean;

export abstract class AbstractValidator {
    abstract validatorFactory(v: Validators): ValidatorDelegate;
}
