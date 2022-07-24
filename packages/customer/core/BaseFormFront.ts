import { makeObservable, action, observable, computed } from 'mobx';
import { MakeObservableOptions } from '../core/types/libs/mobx';
import { ReactHandlers, ReactEvents } from './types/libs/react';

type BaseFormFrontConstructor = new (lang: SupportedLangs) => BaseFormFront;
interface IInvalidFormResponse {
    topError?: string;
    fieldErrors?: Array<{
        name: string;
        message: string;
    }>;
}

export abstract class BaseFormFront {
    [key: string]: any;
    protected lang: SupportedLangs;
    public isRequest = false;
    public isInvalid = false;
    public topError = '';

    /**
     * Observable fields should begin with "_" (for ex. _login)
     */
    private computedFieldNameMask = /^_\w*/;

    constructor(...args: ConstructorParameters<BaseFormFrontConstructor>) {
        this.lang = args[0];
    }

    private getObservableName(fieldName: string) {
        return '_' + fieldName;
    }

    protected makeObservableWrapper() {
        const regex = /^_\w*/;

        const obj: MakeObservableOptions = {
            isRequest: observable,
            isInvalid: observable,
            topError: observable,
            inputUpdateAction: action,
            sendForm: action,
            setErrors: action,
            removeErrors: action,
        };

        /**
         * Добавляем в объект поля дочернего класса, которые нужно отслеживать
         */
        Object.keys(this).forEach((fieldName) => {
            if (regex.test(fieldName)) {
                const computedFieldName = fieldName.slice(1);

                // Only if object has pair like _login + login
                if (this[computedFieldName]) {
                    obj[fieldName] = observable;
                    obj[computedFieldName] = computed;
                }
            }
        });

        makeObservable(
            this,
            // TODO разобраться с типом этого объекта
            obj as MakeObservableOptions<this>,
        );
    }

    protected computeField<T extends string>(
        fieldSchema: FormFieldSchema,
        fieldName: T,
    ): FormFieldComputed {
        const obj: FormFieldComputed = {
            name: fieldName,
            title: fieldSchema.title[this.lang],
            value: fieldSchema.value,
            required: fieldSchema.required,
            error: fieldSchema.error,
        };

        if (fieldSchema.placeholder) {
            obj.placeholder = fieldSchema.placeholder[this.lang];
        }

        return obj;
    }

    public inputUpdateFactory<T extends string>(fieldName: T): ReactHandlers.InputChangeHandler {
        if (Object.keys(this).includes(fieldName)) {
            throw new Error(`Not found Field ${fieldName}`);
        }

        return (ev: ReactEvents.InputUpdateEvent) => this.inputUpdateAction(fieldName, ev);
    }

    public inputUpdateAction(name: string, ev: ReactEvents.InputUpdateEvent) {
        const value: string = ev.target.value;
        const oName = this.getObservableName(name);
        this[oName]['value'] = value;
    }

    private get formData() {
        const formData = new FormData();

        Object.keys(this).forEach((str) => {
            if (this.computedFieldNameMask.test(str)) {
                // Removing '_' for get computed name
                const name = str.slice(1);
                const value = this[str]['value'];
                formData.set(name, value);
            }
        });

        return formData;
    }

    // TODO
    public sendForm() {
        // Mark form as loading
        this.isRequest = true;

        //console.log(this.formData.get('login'));

        const rs = Promise.resolve({
            topError: 'Test',
            fieldErros: [{ name: 'login', message: `test message: ${Math.random}` }],
        });

        rs.then((obj: IInvalidFormResponse) => this.setErrors(obj));
    }

    private removeErrors() {
        if (this.topError) {
            this.topError = '';
        }

        Object.keys(this).forEach((cName) => {
            if (this.computedFieldNameMask.test(cName)) {
                this[cName]['error'] = '';
            }
        });
    }

    private setErrors(obj: IInvalidFormResponse) {
        if (this.isInvalid) {
            this.removeErrors();
        }

        if (obj.topError) {
            this.topError = obj.topError;
        }

        obj.fieldErrors?.forEach((item) => {
            const oName = this.getObservableName(item.name);
            this[oName]['error'] = item.message;
        });
    }
}
