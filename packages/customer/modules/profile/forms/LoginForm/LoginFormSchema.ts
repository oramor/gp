import { Parsers } from '../../../../utils/Parser';
import { Normalizers } from '../../../../utils/Normalizer';
import { Validators } from '../../../../utils/Validator';

export const LoginFormSchema: FormSchema<Parsers, Normalizers, Validators> = {
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
