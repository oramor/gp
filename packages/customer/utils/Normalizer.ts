export class Normalizer {
    public normalizerFactory(type: Normalizers) {
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
