import { FastifyRequest } from 'fastify';

export type GlobalContext = Readonly<{
    config: Config;
}>;

type ActionContext = {} & FastifyRequest;