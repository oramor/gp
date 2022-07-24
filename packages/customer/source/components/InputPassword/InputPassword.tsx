import { ReactHandlers } from '../../../core/types/libs/react';

type InputPasswordProps = FormFieldComputed & {
    onChange?: ReactHandlers.InputChangeHandler;
};

export function InputPassword({ title, onChange }: InputPasswordProps) {
    return (
        <label>
            <span>{title}</span>
            <input type="password" onChange={onChange} />
        </label>
    );
}
