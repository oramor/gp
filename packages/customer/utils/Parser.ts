import { AbstractParser } from '../core/AbstractParser';

export type Parsers = 'email';

export class Parser extends AbstractParser<Parsers> {
    public parserFactory(type: Parsers) {
        switch (type) {
            case 'email':
                return this.emailParser;
            default:
                Error(`Not found Normalizer with type ${type}`);
        }
    }

    emailParser(v: string) {
        const regex = /@/;
        if (regex.test(v)) return true;
        return false;
    }
}
