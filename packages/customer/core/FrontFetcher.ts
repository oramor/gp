import { GlobalContext } from './types/utils';

type FrontFetcherConstructor = new (g: GlobalContext) => FrontFetcher;

export class FrontFetcher {
    protected g: GlobalContext;
    constructor(...args: ConstructorParameters<FrontFetcherConstructor>) {
        this.g = args[0];
    }

    private getEndpoint(uri: string) {
        return new URL(uri, this.g.config.baseApiGateway).href;
    }

    private timeoutReport() {
        return true;
    }

    public async request(obj: FormData | JsonObject, url: string, timeout = 2000) {
        /**
         * В тело запроса может передаваться экземпляр объекта FormData. Такой запрос поступит
         * на сервер в формате multipart/form-data, который парсится, например, через Multer
         */
        const body = obj instanceof FormData ? obj : JSON.stringify(obj);

        const rs = Promise.race([
            fetch(url, {
                method: 'POST',
                body,
            }),
            new Promise((_, reject) => {
                //TODO обработать таймаут в интерфейсе
                setTimeout(() => reject(this.timeoutReport()), timeout);
            }),
        ]);
    }
}
