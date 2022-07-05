import { FastifyObjects } from '../types/libs/fastify';

export type HttpErrorConstructor = new (
    res: FastifyObjects.IRes,
    status?: HttpStatus,
    message?: string,
) => HttpError;

export class HttpError extends Error {
    protected httpStatus: HttpStatus;
    private response: FastifyObjects.IRes;
    constructor(...args: ConstructorParameters<HttpErrorConstructor>) {
        super(args[2]);
        this.response = args[0];
        this.httpStatus = args[1] ?? 500;
    }

    public handle() {
        this.response.status(this.httpStatus).send();
    }
}
