// TODO сейчас нормализаторы возвращают только строковые значения, иначе возникает проблема с редбюсером нормализатора
export type NormalizerDelegate = (v: string | number) => string;

export abstract class AbstractNormalizer {
    abstract normalizerFactory(type: Normalizers): NormalizerDelegate;
}
