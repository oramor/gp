import { GlobalContext } from './types/utils';

export type HandlerConstructor = new (g: GlobalContext) => BaseHandler;

export abstract class BaseHandler {}
