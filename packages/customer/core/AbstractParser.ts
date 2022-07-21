// Парсер тестирует значение и возвращает true, если оно соответствует
export type ParserDelegate<T extends string = DefaultParsers> = (v: T) => boolean;

export abstract class AbstractParser<T = DefaultParsers> {
    abstract parserFactory(type: T): ParserDelegate | void;
}
