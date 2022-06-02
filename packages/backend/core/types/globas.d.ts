type Primitives = string | number | boolean;

type Lang = 'ru' | 'en';

type HttpStatus = 200 | 301 | 302 | 400 | 403 | 404 | 410 | 500;

type ShutdownCode = 'SIGINT' | 'SIGTERM';

type JsonObject = {
    [key: string]: Primitives | JsonObject | JsonObject[]
}

// Currently one-level deep
type PlaceholderValue = Primitives | { [key: string]: Primitives };

type Placeholders = JsonObject;