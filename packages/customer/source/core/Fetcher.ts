import { CONFIG } from '../config';
import { TimeoutExep } from './exeptions/TimeoutExep';

export class Fetcher {
    public static getEndpoint(uri: string) {
        return new URL(uri, CONFIG.baseApiUrl).href;
    }

    public static async request(
        obj: FormData | JsonObject,
        url: string,
        timeout = CONFIG.defaultFetcherTimeout,
    ) {
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
                setTimeout(() => reject(new TimeoutExep()), timeout);
            }) as Promise<Response>,
        ]);

        try {
            const result: Response = await rs;

            const data: ActionResult<DataResult<unknown>> = await result.json();
            //const data = await result.json();

            if (!Object.keys(data).length) {
                throw Error('Empty server response');
            }

            if (data.resultCode === 'data') {
                return data.dto as DefaultDTO;
            }

            // if (data.nextPage) return window.location.assign(data.nextPage);

            // if (data.error) {
            //     const alertContainer = new Alert();
            //     alertContainer.push(data.error.message);
            //     return data.error;
            // }

            // if (data.alert) {
            //     const alertContainer = new Alert();
            //     return alertContainer.push(data.alert.message);
            // }

            return data;
        } catch (e) {
            if (e instanceof TimeoutExep) {
                // TODO можно показать сообщение
                /**
                 * Преполагается, что каждый компонент по-своему
                 * обрабатывает таймауты, поэтому исключение
                 * пробрасывается вызывающему блоку
                 */
                throw e;
            }
            // TODO Показать ошибку
            console.error('POST request error: ', e.message);
        }
    }
}
