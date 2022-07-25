import { AbstractParser } from '../core/AbstractParser';

export class Parser extends AbstractParser {
    public parserFactory(type: Parsers) {
        switch (type) {
            case 'email':
                return this.emailParser;
            default:
                throw Error(`Not found Normalizer with type ${type}`);
        }
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
