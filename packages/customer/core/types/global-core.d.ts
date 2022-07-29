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

// type FormSchemaNodeWithoutMatching = {
//     normalizers?: Normalizers[];
//     validator?: Validators;
// };

// type FormSchemaNodeWithMatching = {
//     matching: {
//         [key: string]: {
//             parser: Parsers;
//             normalizers?: Normalizers[];
//             validator?: Validators;
//         };
//     };
// };

type FormSchemaMatchingNode = {
    parser?: Parsers;
    normalizers?: Normalizers[];
    validator?: Validators;
};

type FormSchemaNode<T extends string> = {
    title: DictionaryNode;
    errors: DictionaryNode;
    required: boolean;
    matching: {
        [key in T]?: FormSchemaMatchingNode;
    };
    placeholder?: DictionaryNode;
};

/**
 * В параметр M передаются поля матчинга. Именно эти поля будут
 * видны в серверном инстансе формы. По умолчанию поля матчатся 1к1,
 * поэтому, если второй параметр не указан, матчинг-поля будут
 * такими же, как в корне схемы.
 */
type FormSchema<T extends FormSchemaFields, M extends string = T> = Record<T, FormSchemaNode<M>>;

/**
 * Объект, который хранит стейт поля формы
 */
// TODO сделать на основе FormSchemaNode (решить вопрос с парсерами)
type FormFieldState = {
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

/**
 * Для каждой формы создается перечисление computed-полей, от которых
 * зависит схема и классы BaseFormServ, BaseFormFront
 */
type FormSchemaFields = string;

/**
 * Actions
 */
type ActionResultCode = 'data' | 'render' | 'invalidForm';

type AbstractActionResult = {
    resultCode: ActionResultCode;
    httpStatus: HttpStatus;
};

type ActionResult<T extends DataResult<unknown> | PageResult> = AbstractActionResult & T;

interface DataResult<T extends DefaultDTO | InvalidFormDTO | unknown> {
    dto: T;
}

interface PageResult {
    htmlPromise: Promise<string>;
}

/**
 * DTO is a data transfer objects. It means objects which transfers
 * between backend and frontend
 */
type DefaultDTO = JsonObject;

interface InvalidFormDTO {
    topError?: string;
    fields?: Array<{
        name: string;
        message: string;
    }>;
}
