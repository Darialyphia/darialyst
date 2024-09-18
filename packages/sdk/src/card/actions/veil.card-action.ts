import { veil } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';

export class VeilCardAction extends CardAction<'veil'> {
  async executeImpl() {
    const modifier = veil({ source: this.card });

    return this.applyModifierConditionally(modifier, this.action.params.activeWhen);
  }
}
