import { IResponse } from '../types/utils';

export type HttpErrorConstructor = new (
    res: IResponse,
    status?: HttpStatus,
    message?: string,
) => HttpError;

export class HttpError extends Error {
    protected httpStatus: HttpStatus;
    private response: IResponse;
    constructor(...args: ConstructorParameters<HttpErrorConstructor>) {
        super(args[2]);
        this.response = args[0];
        this.httpStatus = args[1] ?? 500;
    }

    public handle() {
        this.response.status(this.httpStatus).send();
    }
}
