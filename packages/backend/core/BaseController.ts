/// <reference types="fastify" />

import { FastifyRequest, FastifyReply } from 'fastify';
import { ActionResult, IAction, DataResult } from './BaseAction';
import { GlobalContext } from './types/context';

export class BaseController {
    constructor(public g: GlobalContext) { }

    actionRunner(action: IAction) {
        return async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply | void> => {
            const ctx = req;

            try {
                const result = await action.run(this.g, ctx);

                switch (result.type) {
                    case 'data': {
                        const rs = result as ActionResult<DataResult>;
                        return res.send(rs.json);
                    }
                    default: throw new Error('AppError: Unhandler response');
                }
            } catch (err) {
                // ActionError
                console.log(err.message);
            }
        }
    }
}