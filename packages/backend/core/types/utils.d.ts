import {
    FastifyRequest,
    FastifyReply,
    HookHandlerDoneFunction,
    RouteOptions,
    RouteHandler,
} from 'fastify';
import { TemplateService } from '../../services/templater/TemplateService';

export type GlobalContext = Readonly<{
    config: Config;
    templater: TemplateService;
}>;

export type LocalContext = {
    lang?: SupportedLangs;
};

export type ActionContext = {
    lang: SupportedLangs;
    req: FastifyRequest;
    res: FastifyReply;
};

export type Config = Readonly<{
    port: number;
    domain: string;
    baseUrl: string;
    templateDir: string;
    defaultLang: SupportedLangs;
}>;

export interface IRequest extends FastifyRequest {
    locals?: LocalContext;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResponse extends FastifyReply {}

export type HandlerDoneFunc = HookHandlerDoneFunction;

/**
 * Интерфейс роута, который регистрируется в Fastify (см Server).
 * Обязательно содержит метод запроса, ссылку и обработчик
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRoute extends RouteOptions {}

/**
 * Функция, которая отвечает за обработку запроса. Может возвращать промис,
 * но действия с его значением запрещены (тип unknown). В моей реализации
 * всегда асинхронна, формируется в контроллере и содержит экшн, в котором
 * выполняется вся бизнес-логика
 */
export type HandlerFunc = RouteHandler;
