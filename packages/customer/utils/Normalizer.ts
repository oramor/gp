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

    private lowerCase(v: string) {
        return v.toLowerCase();
    }

    private removeSpaces(v: string) {
        return v.replace(/\s+/g, '');
    }
}
