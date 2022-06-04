import { FastifyRequest } from 'fastify';
import { TemplateService } from '../../services/templater/TemplateService';

export type GlobalContext = Readonly<{
    config: Config;
    templater: TemplateService;
}>;

export type ActionContext = {} & FastifyRequest;

export type Config = Readonly<{
    port: number;
    domain: string;
    baseUrl: string;
    templateDir: string;
}>;