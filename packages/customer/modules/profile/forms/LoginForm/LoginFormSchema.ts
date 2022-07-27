export type LoginFormFields = 'login' | 'password';
export type LoginFormFieldsServ = 'email' | 'password';

export const LoginFormSchema: FormSchema<LoginFormFields, LoginFormFieldsServ> = {
    login: {
        title: {
            ru: 'Логин',
            en: 'Login',
        },
        placeholder: {
            ru: 'Эл. почта или телефон',
            en: 'Email or phone',
        },
        errors: {
            ru: 'Некорректный логин',
            en: 'Incorrect login',
        },
        matching: {
            email: {
                parser: 'email',
                normalizers: ['lowerCase', 'removeSpaces'],
                validator: 'email',
            },
        },
        required: true,
    },
    password: {
        title: {
            ru: 'Пароль',
            en: 'Password',
        },
        errors: {
            ru: 'Некорректный пароль',
            en: 'Incorrect password',
        },
        matching: {
            password: {
                validator: 'password',
            },
        },
        required: true,
    },
};
