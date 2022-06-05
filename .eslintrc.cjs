module.exports = {
    // Указывает, что файл находится в корневой директории
    root: true,
    // Этот плагин только парсит TypeScript
    parser: '@typescript-eslint/parser',
    // А этот выполняет проверки, которые могут быть добавлены в секцию [rules]
    plugins: ['@typescript-eslint'],
    extends: [
        // Включает проверки, которые отмечены флагами в rules: https://eslint.org/docs/rules/
        'eslint:recommended',
        // Включает проверки тайпчекинга по умолчанию: https://typescript-eslint.io/docs/linting/configs
        'plugin:@typescript-eslint/recommended',
        // В документации рекомендуют добавлять последним для разрешения всех конфликтов
        'prettier',
    ],
    parserOptions: {
        // Корневая директория с проектами, относительно которой объявляются ссылк в секции [project]
        tsconfigRootDir: '/home/romaro/react-ssr/packages',
        // Следует указать все конфиги от корня, который указан в tsconfigRootDir
        project: ['backend/tsconfig.json', 'frontend/tsconfig.json'],
        // Декларация ECMAScript модулей (для commonJS использовать script)
        sourceType: 'module',
        ecmaVersion: 2021,
    },
    rules: {
        // Точки с запятой обязательны
        semi: ['error', 'always'],
        // Одинарные кавычки вместо двойных (double): https://eslint.org/docs/rules/quotes
        quotes: ['error', 'single'],
    },
};
