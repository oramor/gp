export type LoginFormFields = 'login' | 'password';

export const LoginFormSchema: FormSchema<LoginFormFields> = {
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
            ru: '',
            en: '',
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
            ru: '',
            en: '',
        },
        matching: {
            password: {
                validator: 'password',
            },
        },
        required: true,
    },
};
