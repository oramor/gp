type Primitives = string | number | boolean;

type HttpMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS';
type HttpStatus = 200 | 301 | 302 | 400 | 403 | 404 | 410 | 500;

type ShutdownCode = 'SIGINT' | 'SIGTERM';

type JsonObject = {
    [key: string]: Primitives | JsonObject | JsonObject[];
};

type RecurciveObject = {
    [key: string]: Primitives | RecurciveObject;
};

// Currently one-level deep for each placeholder value
type PlaceholderValue = Primitives | Record<string, Primitives>;

// ObjectPlaceholders contains root-nodes which extends only from this
type PlaceholdersNode = Record<string, PlaceholderValue>;

type PlaceholdersObject = {
    props?: PlaceholdersNode;
    self?: PlaceholdersNode;
    dict?: PlaceholdersNode;
};

type PlaceholdersFrom<
    T extends PlaceholdersObject = any,
    K extends keyof PlaceholdersObject = any,
> = T[K];

type SupportedLangs = 'ru' | 'en';
type DictionaryNode = Record<Required<SupportedLangs>, string>;
type DictionaryObject = Record<string, DictionaryNode>;
