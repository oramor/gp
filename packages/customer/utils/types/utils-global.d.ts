/**
 * Сюда выносятся типы, на которые есть ссылка в core, но которые
 * могут меняться в зависимости от реализации.
 */
type Normalizers = 'lowerCase' | 'removeSpaces';
type Parsers = 'default' | 'email';
type Validators = 'string' | 'email' | 'phone' | 'password';
