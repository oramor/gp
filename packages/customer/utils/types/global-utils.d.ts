type Parsers = 'email' | 'phone';

type Validators = 'string' | 'email' | 'phone';

type ValidatorFunction = (v: string) => boolean;
