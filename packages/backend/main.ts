import { FastifyServer } from './core/FastifyServer';
import { GlobalContext, Config } from './core/types/utils';

// Servoses
import { TemplateService } from './services/templater/TemplateService';

// Handlers
import { LangHandler } from './core/defaults/handlers/LangHandler';

// Controllers
import { SiteController } from './modules/site/SiteController';

const config: Config = {
    port: 3000,
    domain: 'localhost',
    baseUrl: 'http://localhost',
    templateDir: '/home/romaro/react-ssr/packages/frontend/_pub/views',
    defaultLang: 'ru',
};

async function globalContextFabric(): Promise<GlobalContext> {
    return {
        templater: new TemplateService(),
        config,
    };
}

globalContextFabric()
    .then((g) => {
        const server = new FastifyServer(g);

        server.setPreHandlers([LangHandler]);
        server.setControllers([SiteController]);
        server.start();

        process
            .once('SIGINT', () => server.shutdown('SIGINT'))
            .once('SIGTERM', () => server.shutdown('SIGTERM'));
    })
    .catch((err) => console.log(err.message));
