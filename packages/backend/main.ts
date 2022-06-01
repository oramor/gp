import { FastifyServer } from './core/FastifyServer';
import config from '../../config';

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