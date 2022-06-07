import { BaseAction } from '../../../core/BaseAction';
import { ActionContext, GlobalContext } from '../../../core/types/utils';

export class IndexGET extends BaseAction {
    constructor(g: GlobalContext, ctx: ActionContext) {
        super(g, ctx);
    }
    async run() {
        return this.data({ name: 'ggg' });
    }
}
