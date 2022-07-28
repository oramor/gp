import { AbstractNormalizer } from '../core/AbstractNormalizer';

export class Normalizer extends AbstractNormalizer {
    public normalizerFactory(type: Normalizers) {
        switch (type) {
            case 'lowerCase':
                return this.lowerCase;
            case 'removeSpaces':
                return this.removeSpaces;
            default:
                throw Error(`Not found Normalizer with type ${type}`);
        }
    }

    private lowerCase(v: string | number) {
        if (typeof v === 'string') {
            return v.toLowerCase();
        }
        return v.toString();
    }

    private removeSpaces(v: string | number) {
        if (typeof v === 'string') {
            return v.replace(/\s+/g, '');
        }
        return v.toString();
    }
}
