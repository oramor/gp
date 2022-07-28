import { FormException } from './exeptions/FormException';
import { GlobalContext, ActionContext, BodyFormFieldNode } from './types/utils';

export type BaseFormConstructor = new (
    g: GlobalContext,
    ctx: ActionContext,
) => BaseFormServ<FormSchemaFields>;

export abstract class BaseFormServ<
    Fields extends FormSchemaFields = FormSchemaFields,
    MatchedFields extends string = Fields,
> {
    abstract schema: FormSchema<Fields, MatchedFields>;
    protected g: GlobalContext;
    protected ctx: ActionContext;

    public isInvalid = false;

    /**
     * Это поля, которые доступны при работе с объектом формы
     * на стороне сервера (form.firstName). Названия некоторых
     * полей на бекенды может отличаться от их названия на фронте
     */
    private validFields: { [key in MatchedFields]?: string } = {};
    private invalidFields: InvalidFormDTO['fields'] = [];
    private topError: InvalidFormDTO['topError'] | undefined;
    constructor(...args: ConstructorParameters<BaseFormConstructor>) {
        this.g = args[0];
        this.ctx = args[1];
    }

    public get invalids(): InvalidFormDTO {
        const obj = {} as InvalidFormDTO;
        if (this.topError) {
            obj['topError'] = this.topError;
        }

        if (this.invalidFields) {
            obj['fields'] = this.invalidFields;
        }

        return obj;
    }

    public async init() {
        const req = this.ctx.req;

        if (!req.isMultipart()) {
            throw Error('Not multipart');
        }

        /**
         * Parse multipart to body
         */
        await req.file();
        console.log('fields---------', req.body);

        const body = req.body as Record<Fields, BodyFormFieldNode>;
        if (!body) {
            throw Error('Not found body');
        }

        main: for (const fieldName in body) {
            const rule = this.schema[fieldName];

            if (!rule) {
                this.notFoundInSchemaReport(fieldName);
                continue;
            }

            const { value } = body[fieldName];
            console.log('typeof value------------', typeof value);
            if (!value) {
                this.notFoundInBodyReport(fieldName);
                continue;
            }

            /**
             * Required test
             */
            if (rule.required && value === '') {
                this.requiredReport(fieldName);
                continue;
            }

            /**
             * Объект с матчингами для данного поля
             */
            const matchingRules = rule.matching;
            if (!matchingRules) {
                this.notMatchingRulesReport(fieldName);
                continue;
            }

            /**
             * Начальный стейт: поле считается не подошедшим,
             * пока ни один матчинг не сработал
             */
            let isMatched = false;

            /**
             * Открываем счет попыток матчинга. Число попыток равно
             * количеству правил матчинга для данного поля
             */
            let counter = Object.keys(matchingRules).length;

            /**
             * Имя поля, полученное от клиента, может отличаться от имени,
             * которое используется на сервере и в БД. Кроме того, одному
             * полю на клиенте может соответствовать несколько вариантов
             */
            for (const outputFieldName in matchingRules) {
                /**
                 * Пробуем получить код парсера для данного матчинга
                 */
                const node = matchingRules[outputFieldName] as FormSchemaMatchingNode;

                const parserType = node['parser'];
                if (parserType) {
                    const parser = this.g.parser.parserFactory(parserType);
                    isMatched = parser(value);
                } else {
                    /**
                     * Если парсер отсутствует, считается, что поле безусловно подходит
                     * и начинаем применять нормализацию c валидацией.
                     */
                    isMatched = true;
                }

                /**
                 * Если матчинги для данного поля закончились, а ни один
                 * парсер не сработал, добавляем поле в ошибки, уменьшаем
                 * счетчик и переходим к следующему
                 */
                if (!isMatched) {
                    --counter;

                    /**
                     * Если матчинги закончились, переходим к следующему
                     * полю, добавляя текущее в ошибки
                     */
                    if (counter === 0) {
                        this.notMatchedReport(fieldName);
                        continue main;
                    }
                    continue;
                }

                /**
                 * Раз текущий матчинг подошел, переходим к нормализации,
                 * последовательно применяя нормалайзеры, которые модифицируют
                 * значение, полученное от клиента
                 */
                const normalizers = node['normalizers'];
                if (normalizers) {
                    normalizers.reduce((acc, normalizerType) => {
                        const normalizer = this.g.normalizer.normalizerFactory(normalizerType);
                        return normalizer(acc);
                    }, value);
                }

                const validatorType = node['validator'];
                if (validatorType) {
                    const validator = this.g.validator.validatorFactory(validatorType);
                    if (validator(value)) {
                        this.addValidField(outputFieldName as MatchedFields, value);
                        continue main;
                    }

                    /**
                     * Уменьшаем счетчик попыток матчинга, т.к. по итогу,
                     * не смотря на валиднось парсеру, валидация провалилась.
                     */
                    --counter;

                    if (counter === 0) {
                        /**
                         * Если матчинги для данного поля закончились, текущее
                         * поле добавляется в список не валидных и начинается
                         * обработка следующего
                         */
                        this.notValidatedReport(fieldName);
                    }
                } else {
                    /**
                     * При отсутствии валидатора значение считается валидным
                     */
                    this.addValidField(outputFieldName, value);
                }
            }
        }

        console.log('Invalids-----------', this.invalidFields);
        console.log('Fields-------------', this.fields);
        /**
         * При наличии ошибок, бросаем исключение, которое обрабатывается
         * в контроллере. Можно было бы ограничиться инвалидным статусом
         * у формы, но в этом случае пришлось бы в каждом экшене делать
         * проверку вида if (form.isInvalid) ...
         */
        if (this.isInvalid) {
            throw new FormException(this.g, this.ctx, this.invalids);
        }

        return this;
    }

    public get fields() {
        return this.validFields;
    }

    public setTopError(message: string) {
        this.isInvalid = true;
        this.topError = message;
    }

    private addValidField(outputFieldName: MatchedFields, v: any) {
        this.validFields[outputFieldName] = v;
    }

    private addInvalidField(fieldName: Fields, message: string) {
        this.isInvalid = true;

        console.log('invalid add------', fieldName, message);

        this.invalidFields?.push({
            name: fieldName,
            message,
        });
    }

    private requiredReport(fieldName: Fields) {
        const messages: DictionaryNode = {
            ru: 'Это поле необходимо заполнить',
            en: 'This field is required',
        };
        const lang = this.ctx.lang;
        this.addInvalidField(fieldName, messages[lang]);
    }

    private notValidatedReport(fieldName: Fields) {
        const errors = this['schema'][fieldName]['errors'];
        const lang = this.ctx.lang;
        this.addInvalidField(fieldName, errors[lang]);
    }

    private notMatchingRulesReport(fieldName: Fields) {
        const messages: DictionaryNode = {
            ru: 'Найдено правил обработки для данного поля',
            en: 'Not found matching rules for this field',
        };
        const lang = this.ctx.lang;
        this.addInvalidField(fieldName, messages[lang]);
    }

    private notMatchedReport(fieldName: Fields) {
        const messages: DictionaryNode = {
            ru: 'Не удалось распознать значение в этом поле',
            en: 'This field does not matched',
        };
        const lang = this.ctx.lang;
        this.addInvalidField(fieldName, messages[lang]);
    }

    private notFoundInSchemaReport(fieldName: Fields) {
        const messages: DictionaryNode = {
            ru: 'Поле отсутствует в схеме',
            en: 'Not found in schema',
        };
        const lang = this.ctx.lang;
        this.addInvalidField(fieldName, messages[lang]);
    }

    private notFoundInBodyReport(fieldName: Fields) {
        const messages: DictionaryNode = {
            ru: 'Значение ожидалось, но не получено от клиента',
            en: 'This value did not got from client',
        };
        const lang = this.ctx.lang;
        this.addInvalidField(fieldName, messages[lang]);
    }
}
