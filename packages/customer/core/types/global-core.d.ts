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

type DefaultParsers = 'email' | 'phone';
type DefaultNormalizers = 'lowerCase' | 'removeSpaces';
type DefailtValidators = 'default';

type FormSchemaNode<P, N, V> = {
    title: DictionaryNode;
    errors: DictionaryNode;
    required: boolean;
    matching?: {
        [key: string]: {
            parser?: P;
            normalizers?: N[];
            validator?: V;
        };
    };
    placeholder?: DictionaryNode;
};

type FormSchema<
    F extends string,
    P = DefaultParsers,
    N = DefaultNormalizers,
    V = DefailtValidators,
> = Record<F, FormSchemaNode<P, N, V>>;

// TODO нужно расширять от FormSchemaNode
type FormField = {
    value: string;
    error?: string;
};

/**
 * Объект, который содержит описание поля из схемы
 */
// TODO сделать на основе FormSchemaNode (решить вопрос с парсерами)
type FormFieldSchema = {
    value: string | number;
    title: DictionaryNode;
    errors: DictionaryNode;
    error: string; // computed error
    required: boolean;
    placeholder?: DictionaryNode;
};

/**
 * Объект, который содержит описание поля для компонентов.
 * Вычисляется на основании схемы
 */
type FormFieldComputed = {
    name: string;
    value: string | number;
    title: string;
    required: boolean;
    placeholder?: string;
    error?: string;
};
