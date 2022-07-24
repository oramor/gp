import { ReactHandlers } from '../../../core/types/libs/react';

type InputPasswordProps = FormFieldComputed & {
    onChange?: ReactHandlers.InputChangeHandler;
};

export function InputPassword({ title, error, onChange }: InputPasswordProps) {
    return (
        <div>
            <label>
                <span>{title}</span>
                <input type="password" onChange={onChange} />
            </label>
            {error && <div>error</div>}
        </div>
    );
}
