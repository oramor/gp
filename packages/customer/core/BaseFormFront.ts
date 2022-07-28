import { makeObservable, action, observable, computed } from 'mobx';
import { MakeObservableOptions } from '../core/types/libs/mobx';
import { ReactHandlers, ReactEvents } from './types/libs/react';
import { Fetcher } from '../source/core/Fetcher';

type BaseFormFrontConstructor = new (lang: SupportedLangs) => BaseFormFront;

export abstract class BaseFormFront {
    abstract apiURI: string;
    [key: string]: any;
    protected lang: SupportedLangs;
    public isRequest = false;
    public isInvalid = false;
    public invalidFields: string[] = [];
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
            updateFieldErrorAction: action,
            updateTopErrorAction: action,
            isRequestAction: action,
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

    protected computeField<T extends string>(fieldSchema: FormFieldState, fieldName: T) {
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

    private async getFormData() {
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

    public isRequestAction(b: boolean) {
        if (b) {
            this.isRequest = true;
        } else {
            this.isRequest = false;
        }
    }

    public async sendForm() {
        // Mark form as loading
        this.isRequestAction(true);

        // Get field values
        const formData = await this.getFormData();

        for (const key of formData.keys()) {
            console.log('---------formDataKeys: ', key, ' value: ', formData.get(key));
        }

        // API request
        const url = Fetcher.getEndpoint(this['apiURI']);

        try {
            const data = (await Fetcher.request(formData, url)) as ActionResult<
                DataResult<unknown>
            >;

            if (data.resultCode === 'invalidForm') {
                const dto = data.dto as InvalidFormDTO;
                this.updateErrors(dto);
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            }
        }

        this.isRequestAction(false);

        // const obj = {
        //     topError: 'Test',
        //     fieldErrors: [{ name: 'login', message: `test message: ${Math.random()}` }],
        // };

        // const rs = new Promise((resolve) => {
        //     console.log('start promise');
        //     setTimeout(() => resolve(obj), 1000);
        // });

        // rs.then((obj) => {
        //     this.setErrors(obj as IInvalidFormResponse);
        //     console.log('end promise');
        //     this.isRequestAction(false);
        // });
    }

    public resetErrors() {
        if (this.topError) {
            this.updateTopErrorAction('');
        }

        this.invalidFields.forEach((fieldName) => {
            this.updateFieldErrorAction(fieldName, '');
        });
    }

    public updateErrors(obj: InvalidFormDTO) {
        console.log('---stat set errors');
        console.log(obj);
        if (this.isInvalid) {
            this.resetErrors();
        }

        if (obj.topError) {
            this.updateTopErrorAction(obj.topError);
        }

        obj.fieldErrors?.forEach((item) => {
            this.updateFieldErrorAction(item.name, item.message);
            this.invalidFields.push(item.name);
        });

        console.log(this.invalidFields);
    }

    public updateFieldErrorAction(fieldName: string, message: string) {
        const oName = this.getObservableName(fieldName);
        this[oName]['error'] = message;
    }

    public updateTopErrorAction(message: string) {
        this.topError = message;
    }
}
