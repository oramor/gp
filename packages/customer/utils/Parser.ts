import { AbstractParser } from '../core/AbstractParser';

export class Parser extends AbstractParser {
    public parserFactory(type: Parsers) {
        switch (type) {
            case 'default':
                return this.defaultParser;
            case 'email':
                return this.emailParser;
            default:
                throw Error(`Not found Normalizer with type ${type}`);
        }
    }

    defaultParser(v: string | number) {
        return !!v;
    }

    emailParser(v: string | number) {
        if (typeof v !== 'string') {
            return false;
        }

        const regex = /@/;
        if (regex.test(v)) return true;
        return false;
    }
}
