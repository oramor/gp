module.exports = {
    // Объявляет синтаксический парсер TypeScript
    parser: '@typescript-eslint/parser',
    // Объявляет палагин проверок синтаксиса TS
    plugins: ['@typescript-eslint'],
    // Настройки парсера
    parserOptions: {
        // Декларация ECMAScript модулей (для commonJS использовать script)
        sourceType: 'module',
        ecmaVersion: 2021,
        // Следует указать все конфиги, по которым линтер будет делать тайпчекинг
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
    },
    extends: [
        // Иначе не будут действовать правила, отмеченные флагами в rules
        'eslint:recommended',
        // Включает конфигурацию проверок по умолчанию https://typescript-eslint.io/docs/linting/configs
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    rules: {
        // Точки с запятой обязательны
        semi: ['error', 'always'],
        // Одинарные кавычки вместо двойных (double)
        quotes: ['error', 'single'],
    },
};
