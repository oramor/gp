type Primitives = string | number | boolean;

type Lang = 'ru' | 'en';

type HttpStatus = 200 | 301 | 302 | 400 | 403 | 404 | 410 | 500;

type ShutdownCode = 'SIGINT' | 'SIGTERM';

type JsonObject = {
    [key: string]: Primitives | JsonObject | JsonObject[];
};

// Currently one-level deep for each placeholder value
type PlaceholderValue = Primitives | Record<string, Primitives>;

// ObjectPlaceholders contains root-nodes which extends only from this
type PlaceholdersNode = Record<string, PlaceholderValue>;

type ObjectPlaceholders = {
    static?: PlaceholdersNode;
    props?: PlaceholdersNode;
};

type PlaceholdersFrom<
    T extends ObjectPlaceholders = any,
    K extends keyof ObjectPlaceholders = any,
> = T[K];
