import * as Fastify from 'fastify';

export namespace FastifyHandlers {
    /**
     * Функция, которая отвечает за обработку запроса. Может возвращать промис,
     * но действия с его значением запрещены (тип unknown). В моей реализации
     * всегда асинхронна, формируется в контроллере и содержит экшн, в котором
     * выполняется вся бизнес-логика
     *
     * Видимо, внутри данной функции всегда должен вызываться метод send()
     * для завершения обработки запроса
     */
    export type RouteHandler = Fastify.RouteHandler;

    /**
     * Функции для предварительной обработки запросов
     */
    export type PreHandler = Fastify.preHandlerHookHandler;

    /**
     * Сигнатура функции done(), которая должна вызываться для завершения
     * обработки запроса. Аналог экспрессовского next()
     */
    export type HandlerDone = Fastify.HookHandlerDoneFunction;
}

export namespace FastifyObjects {
    /**
     * Объект запроса
     */
    export type IReq = Fastify.FastifyRequest;

    /**
     * Объект ответа
     */
    export type IRes = Fastify.FastifyReply;

    /**
     * Объект, который принимает функция установки обработчиков Not Found
     * для запросов, роут по которым не найден
     * https://www.fastify.io/docs/latest/Reference/Server/#setnotfoundhandler
     * Напрямую setNotFoundHandler из instanse.d.ts не экспортируется
     */
    export interface INotFoundOptions {
        opts?: {
            preHandler?: FastifyHandlers.PreHandler;
        };
        handler: FastifyHandlers.RouteHandler;
    }

    /**
     * Интерфейс роута, который регистрируется в Fastify (см Server).
     * Обязательно содержит метод запроса, ссылку и обработчик
     */
    export type IRouteOptions = Fastify.RouteOptions;
}
