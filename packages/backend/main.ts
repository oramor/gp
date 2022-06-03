import { FastifyServer } from './core/FastifyServer';
import { GlobalContext } from './core/types/context';

import { TemplateService } from './services/templater/TemplateService';

const config: Config = {
    port: 3000,
    domain: 'localhost',
    baseUrl: 'http://localhost',
    templateDir: '/home/romaro/react-ssr/packages/frontend/dist/public/views'
};

async function GlobalContextConstructor(): Promise<GlobalContext> {
    return {
        templater: new TemplateService,
        config
    };
}

GlobalContextConstructor()
    .then(g => {
        const server = new FastifyServer(g);
        server.start();

        process
            .once('SIGINT', _ => server.shutdown('SIGINT'))
            .once('SIGTERM', _ => server.shutdown('SIGTERM'));
    })
    .catch(err => console.log(err.message));