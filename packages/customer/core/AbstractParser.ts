type DefaultParsers = 'email' | 'phone';

export type ParserDelegate<T extends string | number = string, R = DefaultParsers> = (v: T) => R;
