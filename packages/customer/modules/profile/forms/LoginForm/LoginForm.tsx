import { observer } from 'mobx-react';
import { LoginFormFront } from './LoginFormFront';
import { SendButton } from '../../../../source/components/SendButton/SendButton';
import { InputText } from '../../../../source/components/InputText/InputText';
import { InputPassword } from '../../../../source/components/InputPassword/InputPassword';

// TODO lang
const form = new LoginFormFront('ru');

const onChangeLoginHandler = form.inputUpdateFactory('login');
const onChangePasswordHandler = form.inputUpdateFactory('password');

export const LoginForm = observer(() => {
    return (
        <form>
            <InputText {...form.login} onChange={onChangeLoginHandler} />
            <InputPassword {...form.login} onChange={onChangePasswordHandler} />
            <SendButton title="Отправить" onClick={form.sendForm} />
        </form>
    );
});
