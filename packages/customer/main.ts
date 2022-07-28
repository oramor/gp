import { FastifyServer } from './core/FastifyServer';
import { GlobalContext, Config } from './core/types/utils';
import { Parser } from './utils/Parser';
import { Validator } from './utils/Validator';
import { Normalizer } from './utils/Normalizer';

// Services
import { TemplateService } from './services/templater/TemplateService';

// Handlers
import { LangHandler } from './core/defaults/handlers/LangHandler';

// Controllers
import { SiteController } from './modules/site/SiteController';
import { ProfileController } from './modules/profile/ProfileController';

const config: Config = {
    port: 3000,
    host: '0.0.0.0',
    domain: 'localhost',
    baseUrl: 'http://localhost',
    baseApiGateway: 'http://localhost',
    templatesDir:
        process.env['SITE_TEMPLATE_DIR'] ?? '/home/romaro/gp/packages/customer/_public/views',
    templatesExtension: process.env['SITE_TEMPLATES_EXT'] ?? 'hbs',
    defaultLang: 'ru',
};

async function globalContextFactory(): Promise<GlobalContext> {
    return {
        templater: new TemplateService(),
        config,
        parser: new Parser(),
        normalizer: new Normalizer(),
        validator: new Validator(),
    };
}

globalContextFactory()
    .then((g) => {
        const server = new FastifyServer(g);

        server.setPreHandlers([LangHandler]);
        server.setControllers([SiteController, ProfileController]);
        server.start();

        process
            .once('SIGINT', () => server.shutdown('SIGINT'))
            .once('SIGTERM', () => server.shutdown('SIGTERM'));
    })
    .catch((err) => console.log(err.message));
