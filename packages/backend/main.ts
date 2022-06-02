import { FastifyServer } from './core/FastifyServer';
import { GlobalContext } from './core/types/context';

const config: Config = {
    port: 3000,
    domain: 'localhost',
    baseUrl: 'http://localhost'
};

async function GlobalContextConstructor(): Promise<GlobalContext> {
    return { config };
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