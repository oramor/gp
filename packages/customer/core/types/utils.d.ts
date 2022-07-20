import { TemplateService } from '../../services/templater/TemplateService';
import { FastifyObjects } from './libs/fastify';

export type GlobalContext = Readonly<{
    config: Config;
    templater: TemplateService;
    //TODO add core/abstracts/AbstractParser
    parser: any;
    validator: any;
    normalizer: any;
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
