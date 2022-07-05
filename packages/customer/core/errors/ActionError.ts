import { ActionContext } from '../types/utils';

export type ActionErrorConstructor = new (ctx: ActionContext, message?: string) => ActionError;

export class ActionError extends Error {
    protected ctx: ActionContext;
    constructor(...args: ConstructorParameters<ActionErrorConstructor>) {
        super(args[1]);
        this.ctx = args[0];
    }

    public handle() {
        this.ctx.res.status(500).send({ message: 'Action error' });
    }
}
