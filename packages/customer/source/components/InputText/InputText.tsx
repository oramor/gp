import { ReactHandlers } from '../../../core/types/libs/react';

type InputTextProps = FormFieldComputed & {
    onChange?: ReactHandlers.InputChangeHandler;
};

export function InputText({ title, placeholder, error, onChange }: InputTextProps) {
    return (
        <div>
            <label>
                <span>{title}</span>
                <input type="text" placeholder={placeholder} onChange={onChange} />
            </label>
            {error && <div>error</div>}
        </div>
    );
}
