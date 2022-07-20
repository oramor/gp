type ValidatorDelegate = (v: string | number) => boolean;

export abstract class BaseValidator {
    [K: string]: ValidatorDelegate;
}
