/**
 * По дефолту функция возвращает тот же тип значения, что и принимает (R = T)
 */

// export type NormalizerDelegate<
//     T extends string | number = string,
//     R extends string | number = T,
// > = (v: T) => R;

export type NormalizerDelegate<T extends string | number> = (v: T) => T;

export abstract class AbstractNormalizer {
    abstract normalizerFactory(type: Normalizers): NormalizerDelegate<string | number>;
}
