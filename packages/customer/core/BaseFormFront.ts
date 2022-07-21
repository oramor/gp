import { makeObservable, action, observable, computed, AnnotationMapEntry } from 'mobx';
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

        type Test = {
            //[P in Exclude<keyof this, 'toString'>]?: AnnotationMapEntry;
            [key: string]: AnnotationMapEntry;
        };

        const obj: Test = {
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
            obj as { [P in Exclude<keyof this, 'toString'>]?: AnnotationMapEntry },
        );
    }

    public inputUpdateFactory(fieldName: string): ReactHandlers.InputUpdateHandler {
        if (Object.keys(this).includes(fieldName)) {
            throw new Error(`Not found Field ${fieldName}`);
        }

        return (ev: ReactEvents.InputUpdateEvent) => this.inputUpdateAction(fieldName, ev);
    }

    public inputUpdateAction(name: string, ev: ReactEvents.InputUpdateEvent) {
        const value: string = ev.target.value;
        this[name]['value'] = value;
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
