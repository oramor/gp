type HttpStatus = 200 | 301 | 302 | 400 | 403 | 404 | 410 | 500;
type ShutdownCode = 'SIGINT' | 'SIGTERM';

type GlobalContext = Readonly<{
    config: Config;
}>;