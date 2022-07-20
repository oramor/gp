import { AbstractNormalizer, NormalizerDelegate } from '../core/AbstractNormalizer';

type Normalizers = 'email' | 'phone';

export class Normalizer extends AbstractNormalizer<Normalizers> {
    public normalizerFactory(type: Normalizers): NormalizerDelegate | void {
        switch (type) {
            case 'phone':
                return this.phoneNormalizer;
            case 'email':
                return this.emailNormalizer;
            default:
                Error(`Not found Normalizer with type ${type}`);
        }
    }

    private phoneNormalizer(v: string) {
        return v;
    }

    private emailNormalizer(v: string) {
        return v;
    }
}
