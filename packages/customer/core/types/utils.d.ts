import { TemplateService } from '../../services/templater/TemplateService';
import { FastifyObjects } from './libs/fastify';
import { AbstractNormalizer } from '../AbstractNormalizer';
import { AbstractValidator } from '../AbstractValidator';
import { AbstractParser } from '../AbstractParser';

export type GlobalContext = Readonly<{
    config: Config;
    templater: TemplateService;
    parser: AbstractParser;
    validator: AbstractValidator;
    normalizer: AbstractNormalizer;
}>;

export type LocalsObject = {
    lang?: SupportedLangs;
};

/**
 * Базовый контекст готовится на уровне контроллера, до обработки
 * запроса. Затем он может быть расширен (например, добавление
 * body для форм)
 */
export type ActionContext = {
    method: HttpMethods;
    lang: SupportedLangs;
    req: IRequest;
    res: FastifyObjects.IRes;
};

/**
 * Объект, в который упаковывается описание каждого поля,
 * полученного из @fastify/multiform. Эти поля помещаются
 * в body запроса при условии, что опция attachFieldsToBody
 * активна
 */
interface BodyFormFieldNode {
    fieldname: string;
    value: string;
    mimetype?: string;
    encoding: string;
    fieldnameTruncated: boolean;
    valueTruncated: boolean;
}

export type Config = Readonly<{
    port: number;
    host: string;
    domain: string;
    baseUrl: string;
    baseApiGateway: string;
    templatesDir: string;
    templatesExtension: string;
    defaultLang: SupportedLangs;
    defaults?: {
        services?: {
            templateService?: {
                name: string;
            };
        };
    };
}>;

/**
 * У Fastify нет предустановленного поля в объекте запроса,
 * через который можно транспортировать данные. Поэтому данное поле
 * расширяется хуком onRequest при созании инстанса сервера.
 */
export interface IRequest extends FastifyObjects.IReq {
    locals?: LocalsObject;
}
