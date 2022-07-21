import { AbstractNormalizer, NormalizerDelegate } from '../core/AbstractNormalizer';

export type Normalizers = 'lowerCase' | 'removeSpaces';

export class Normalizer extends AbstractNormalizer<Normalizers> {
    public normalizerFactory(type: Normalizers): NormalizerDelegate | void {
        switch (type) {
            case 'lowerCase':
                return this.lowerCase;
            case 'removeSpaces':
                return this.removeSpaces;
            default:
                Error(`Not found Normalizer with type ${type}`);
        }
    }

    private lowerCase(v: string) {
        return v.toLowerCase();
    }

    private removeSpaces(v: string) {
        return v.replace(/\s+/g, '');
    }
}
