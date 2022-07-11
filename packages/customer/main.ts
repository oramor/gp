import { FastifyServer } from './core/FastifyServer';
import { GlobalContext, Config, EnvObject } from './core/types/utils';
import * as dotenv from 'dotenv';

// Services
import { TemplateService } from './services/templater/TemplateService';

// Handlers
import { LangHandler } from './core/defaults/handlers/LangHandler';

// Controllers
import { SiteController } from './modules/site/SiteController';

const env = dotenv.config().parsed as EnvObject;

const config: Config = {
    port: 3000,
    host: '0.0.0.0',
    domain: 'localhost',
    baseUrl: 'http://localhost',
    templateDir: env.SITE_TEMPLATE_DIR ?? new Error('Not found templateDir in .env'),
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
