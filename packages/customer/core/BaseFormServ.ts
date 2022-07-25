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
            ru: 'Это поле нужно заполнить',
            en: 'This field is required',
        };
        const lang = this.ctx.lang;
        return messages[lang];
    }

    getValidatorErrorMessage(rule: FormSchemaNode) {
        const lang = this.ctx.lang;
        return rule.errors[lang];
    }

    // schema: FormSchema<Fields>
    //schema: Record<string, any>
    protected make() {
        main: for (const fieldName in this.ctx.body) {
            const rule = this.schema[fieldName];
            const { value } = this.ctx.body[fieldName];

            /**
             * Required test
             */
            if (rule.required && !value) {
                this.addFieldError(fieldName, this.requredErrorMessage);
                continue;
            }

            /**
             * Имя поля, полученное от клиента, может отличаться от имени,
             * которое используется на сервере и в БД. Кроме того, одному
             * полю на клиенте может соответствовать несколько вариантов
             */
            for (const outputFieldName in rule.matching) {
                /**
                 * Пробуем получить парсинг для данного матчинга
                 */
                const parserType = rule.matching[outputFieldName].parser;
                if (parserType) {
                    const parser = this.g.parser.parserFactory(parserType);
                    if (parser(value)) {
                        /**
                         * Получаем массив с кодами нормализаторов
                         */
                        const normalizers = rule.matching[outputFieldName].normalizers;
                        if (normalizers) {
                            normalizers.reduce((acc, normalizerType) => {
                                /**
                                 * Получаем нормалазейр
                                 */
                                const normalizer =
                                    this.g.normalizer.normalizerFactory(normalizerType);
                                return normalizer(acc);
                            }, value);
                        }

                        /**
                         * Валидация
                         */
                        const validatorType = rule.matching[outputFieldName].validator;
                        if (validatorType) {
                            const validator = this.g.validator.validatorFactory(validatorType);
                            if (validator(value)) {
                                this.addField(outputFieldName, value);
                                //TODO
                                continue main;
                            }
                            const errMessage = this.getValidatorErrorMessage(rule);

                            /**
                             * Возвращается именно fieldName, а не outputFieldName,
                             * т.е. клиентское имя поля, а не серверное
                             */
                            this.addFieldError(fieldName, errMessage);
                        }
                    }
                }
            }
        }
    }
}
