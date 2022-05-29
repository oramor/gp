/// <reference types="fastify" />

import { FastifyRequest, FastifyReply } from 'fastify';

export class BaseController {
    actionRunner(action) {
        return async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply | void> => {
            try {
                const result = await action.run();

                if (result.json) {
                    return res.send({ hello: 'world' });
                }

                throw new Error('AppError: Unhandler response');
            } catch (err) {
                console.log(err.message);
            }
        }
    }
}