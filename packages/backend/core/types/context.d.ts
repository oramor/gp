import { FastifyRequest } from 'fastify';
import { TemplateService } from '../../services/templater/TemplateService';

export type GlobalContext = Readonly<{
    config: Config;
    templater: TemplateService;
}>;

type ActionContext = {} & FastifyRequest;