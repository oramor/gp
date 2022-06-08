import { FastifyServer } from './core/FastifyServer';
import { GlobalContext, Config } from './core/types/utils';

import { TemplateService } from './services/templater/TemplateService';

import { LangHandler } from './handlers/LangHandler';

const config: Config = {
    port: 3000,
    domain: 'localhost',
    baseUrl: 'http://localhost',
    templateDir: '/home/romaro/react-ssr/packages/frontend/_pub/views',
    defaultLang: 'ru',
};

async function GlobalContextConstructor(): Promise<GlobalContext> {
    return {
        templater: new TemplateService(),
        config,
    };
}

GlobalContextConstructor()
    .then((g) => {
        const server = new FastifyServer(g);

        server.setPreHandlers([LangHandler]);
        server.start();

        process
            .once('SIGINT', () => server.shutdown('SIGINT'))
            .once('SIGTERM', () => server.shutdown('SIGTERM'));
    })
    .catch((err) => console.log(err.message));
