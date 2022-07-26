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

export type ActionContext = {
    method: HttpMethods;
    lang: SupportedLangs;
    req: IRequest;
    res: FastifyObjects.IRes;
};

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

/**
 * Вариант контекста для формы, при котором body присутствует
 * обязательно
 */
type ActionContextForm<Fields extends string> = ActionContext & {
    body: Record<Fields, IFormDescription>;
};

/**
 * Формат объекта с описанием поля формы, который сервер
 * получает от клиента
 */
interface IFormDescription {
    value: string | number;
}
