// По дефолту функция возвращает тот же тип значения, что и принимает (R = T)
export type NormalizerDelegate<T extends string | number = string, R = T> = (v: T) => R;

export abstract class AbstractNormalizer<T = string> {
    abstract normalizerFactory(type: T): NormalizerDelegate | void;
}
