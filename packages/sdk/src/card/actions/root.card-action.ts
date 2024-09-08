import { blast, rooted } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';

export class RootCardAction extends CardAction<'root'> {
  async executeImpl() {
    const modifier = rooted({ source: this.card });

    return this.applyModifierConditionally(modifier, this.action.params.activeWhen);
  }
}
