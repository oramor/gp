/**
 * Парсер тестирует значение и возвращает true, если оно соответствует.
 * Пока парсеры могут принимать только строки
 */

export type ParserDelegate = (v: string | number) => boolean;

export abstract class AbstractParser {
    abstract parserFactory(type: Parsers): ParserDelegate;
}
