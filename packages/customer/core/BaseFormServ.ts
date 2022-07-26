import { GlobalContext, ActionContextForm } from './types/utils';

type FormConstructor = new (
    g: GlobalContext,
    ctx: ActionContextForm<FormSchemaFields>,
) => BaseFormServ<FormSchemaFields>;

export abstract class BaseFormServ<Fields extends FormSchemaFields = FormSchemaFields> {
    abstract schema: FormSchema<Fields>;
    protected g: GlobalContext;
    protected ctx: ActionContextForm<Fields>;
    private outputFields: Record<string, string> = {};
    private fieldErrors: Record<string, string> = {};
    constructor(...args: ConstructorParameters<FormConstructor>) {
        this.g = args[0];
        this.ctx = args[1];
    }

    get fields() {
        return this.outputFields;
    }

    addField(outputFieldName: string, v: any) {
        this.outputFields[outputFieldName] = v;
    }

    addFieldError(fieldName: Fields, message: string) {
        this.fieldErrors[fieldName] = message;
    }

    get requredErrorMessage() {
        const messages: DictionaryNode = {
            ru: 'Это поле необходимо заполнить',
            en: 'This field is required',
        };
        const lang = this.ctx.lang;
        return messages[lang];
    }

    get notMatchedErrorMessage() {
        const messages: DictionaryNode = {
            ru: 'Не удалось распознать значение в этом поле',
            en: 'This field does not matched',
        };
        const lang = this.ctx.lang;
        return messages[lang];
    }

    notFoundInSchemaReport(fieldName: Fields) {
        const messages: DictionaryNode = {
            ru: 'Поле отсутствует в схеме',
            en: 'Not found in schema',
        };
        const lang = this.ctx.lang;
        this.addFieldError(fieldName, messages[lang]);
    }

    notFoundInBodyReport(fieldName: Fields) {
        const messages: DictionaryNode = {
            ru: 'Значение ожидалось, но не передано клиентом',
            en: 'This value did not got from client',
        };
        const lang = this.ctx.lang;
        this.addFieldError(fieldName, messages[lang]);
    }

    getValidatorErrorMessage(rule: FormSchemaNode) {
        const lang = this.ctx.lang;
        return rule.errors[lang];
    }

    protected make() {
        main: for (const fieldName in this.ctx.body) {
            const rule = this.schema[fieldName];

            if (!rule) {
                this.notFoundInSchemaReport(fieldName);
                continue;
            }

            const { value } = this.ctx.body[fieldName];
            if (!value) {
                this.notFoundInBodyReport(fieldName);
                continue;
            }

            /**
             * Required test
             */
            if (rule.required && value === '') {
                this.addFieldError(fieldName, this.requredErrorMessage);
                continue;
            }

            /**
             * Начальный стейт: поле считается не подошедшим,
             * пока не один матчинг не сработал
             */
            let isMatched = false;

            /**
             * Имя поля, полученное от клиента, может отличаться от имени,
             * которое используется на сервере и в БД. Кроме того, одному
             * полю на клиенте может соответствовать несколько вариантов
             */
            for (const outputFieldName in rule.matching) {
                /**
                 * Открываем счет полей матчинга. Если ни один из матчингов
                 * не сработает, следует вернуть ошибку валидации
                 */
                let counter = Object.keys(rule.matching).length;

                /**
                 * Последовательно применяет нормалайзеры, модифицируя
                 * полученное от клиента значение поля
                 */
                const normalize = () => {
                    const normalizers = rule.matching[outputFieldName].normalizers;
                    if (normalizers) {
                        normalizers.reduce((acc, normalizerType) => {
                            const normalizer = this.g.normalizer.normalizerFactory(normalizerType);
                            return normalizer(acc);
                        }, value);
                    }
                };

                /**
                 * Применяет валадицию нормализованного значения. Специального
                 * контроля нет, просто нужно иметь в виду, что валидатор
                 * следует вызывать после нормализатора
                 */
                const validate = () => {
                    const validatorType = rule.matching[outputFieldName].validator;
                    if (validatorType) {
                        const validator = this.g.validator.validatorFactory(validatorType);
                        if (validator(value)) {
                            this.addField(outputFieldName, value);
                        }

                        /**
                         * Возвращается именно fieldName, а не outputFieldName,
                         * т.е. клиентское имя поля, а не серверное
                         */
                        const errMessage = this.getValidatorErrorMessage(rule);
                        this.addFieldError(fieldName, errMessage);
                    }
                };

                /**
                 * Пробуем получить код парсера для данного матчинга
                 */
                const parserType = rule.matching[outputFieldName].parser;
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
                 * Если парсер найден, но не подходит, переходим к следующему
                 * полю матчинга, уменьшая счетчик
                 */
                if (!isMatched) {
                    counter--;

                    /**
                     * Если матчинги для данного поля закончились, а ни один
                     * парсер не сработал, добавляем поле в ошибки
                     * и переходим к следующему
                     */
                    if (counter === 0) {
                        this.addFieldError(fieldName, this.notMatchedErrorMessage);
                        continue main;
                    }
                    continue;
                }

                /**
                 * Раз текущий матчинг подошел для значения, выполняем
                 * нормализацию и валидацию
                 */
                normalize();

                /**
                 * Если валидация не прошла, уменьшаем счетчик с пометкой,
                 * что поле не валидно для данного парсера
                 */
                validate();
            }
        }
    }
}
