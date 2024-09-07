import { structure } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';

export class StructureCardAction extends CardAction<'structure'> {
  async executeImpl() {
    const modifier = structure(this.card);
    console.log(modifier);
    return this.applyModifierConditionally(modifier, this.action.params.activeWhen);
  }
}
