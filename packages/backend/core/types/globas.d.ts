type Lang = 'ru' | 'en';

type HttpStatus = 200 | 301 | 302 | 400 | 403 | 404 | 410 | 500;

type ShutdownCode = 'SIGINT' | 'SIGTERM';

type JsonObject = {
    [key: string]: string | number | boolean | JsonObject | JsonObject[]
}

type Placeholders = JsonObject;