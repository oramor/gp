import { ActionContext, GlobalContext } from './types/utils';

type Parsers = 'phone' | 'email';

type NormalizerDelegate<T extends string | number = string, R = any> = (v: T) => R;
type ValidatorDelegate = (v: string | number) => boolean;
type ParserDelegate = (v: string | number) => string | number;

type Pipe = [NormalizerDelegate?, ValidatorDelegate?];

type ParseNode = {
    parse: {
        [K in Parsers]: Pipe;
    };
};

interface CheckingSchema {
    [K: string]: ParseNode | Pipe;
}

type FormConstructor = new (g: GlobalContext, ctx: ActionContext) => BaseForm;

abstract class BaseValidator {
    [K: string]: ValidatorDelegate;
}

abstract class BaseNormalizer {
    [K: string]: NormalizerDelegate<string> | NormalizerDelegate<number>;
}

// abstract class BaseParser {
//     [K in Parsers]: ParserDelegate;
// }

class Normalizer extends BaseNormalizer {
    static email(v: string) {
        return v.toLowerCase;
    }
}

class Validator extends BaseValidator {
    static email(v: string | number) {
        if (typeof v === 'number') return false;

        const regex = /^([A-Za-z0-9_\-\\.])+@([A-Za-z0-9_\-\\.])+\.([A-Za-z]{2,4})$/;
        return regex.test(v);
    }
}

export abstract class BaseForm {
    abstract schema: CheckingSchema;
    protected g: GlobalContext;
    protected ctx: ActionContext;
    //protected validate: BaseValidator;
    constructor(...args: ConstructorParameters<FormConstructor>) {
        this.g = args[0];
        this.ctx = args[1];
    }

    private parse(value: string | number, node: ParseNode) {
        for (const parseMethod in node) {
            // this.g.parse[parseMethod](v)
        }
    }
}
