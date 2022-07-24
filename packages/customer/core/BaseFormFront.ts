import { makeObservable, action, observable, computed } from 'mobx';
import { MakeObservableOptions } from '../core/types/libs/mobx';
import { ReactHandlers, ReactEvents } from './types/libs/react';

type BaseFormFrontConstructor = new (lang: SupportedLangs) => BaseFormFront;

export abstract class BaseFormFront {
    [key: string]: any;
    protected lang: SupportedLangs;
    public isRequest = false;
    constructor(...args: ConstructorParameters<BaseFormFrontConstructor>) {
        this.lang = args[0];
    }

    protected makeObservableWrapper() {
        const regex = /^_\w*/;

        const obj: MakeObservableOptions = {
            isRequest: observable,
            inputUpdateAction: action,
            sendForm: action,
            setRequestOff: action,
            setRequestOn: action,
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
        const stateName = '_' + name;
        this[stateName]['value'] = value;
    }

    private get formData() {
        const formData = new FormData();

        // Fields should begin with "_" (for ex. _login)
        const regex = /^_\w*/;

        Object.keys(this).forEach((str) => {
            if (regex.test(str)) {
                const name = str.slice(1);
                const value = this[str]['value'];
                formData.set(name, value);
            }
        });

        return formData;
    }

    // TODO
    public sendForm() {
        this.setRequestOn();
        console.log(this.formData.get('login'));
    }

    public setRequestOff() {
        this.isRequest = false;
    }

    public setRequestOn() {
        this.isRequest = true;
    }
}
