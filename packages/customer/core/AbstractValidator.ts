export type ValidatorDelegate<T extends string = DefailtValidators> = (v: T) => boolean;

export abstract class AbstractValidator<T = DefailtValidators> {
    abstract validatorFactory(v: T): ValidatorDelegate | void;
}
