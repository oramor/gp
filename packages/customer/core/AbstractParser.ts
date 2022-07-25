/**
 * Парсер тестирует значение и возвращает true, если оно соответствует.
 * Пока парсеры могут принимать только строки
 */

export type ParserDelegate = (v: string) => boolean;

export abstract class AbstractParser {
    abstract parserFactory(type: Parsers): ParserDelegate | void;
}
