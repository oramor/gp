import { ReactHandlers } from '../../../core/types/libs/react';

type InputTextProps = FormFieldComputed & {
    onChange?: ReactHandlers.InputChangeHandler;
};

export function InputText({ title, placeholder, onChange }: InputTextProps) {
    return (
        <label>
            <span>{title}</span>
            <input type="text" placeholder={placeholder} onChange={onChange} />
        </label>
    );
}
