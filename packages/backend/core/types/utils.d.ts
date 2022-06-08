import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
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
