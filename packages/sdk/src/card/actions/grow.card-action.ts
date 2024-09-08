import { grow } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';

export class GrowCardAction extends CardAction<'grow'> {
  protected async executeImpl() {
    const modifier = grow({
      source: this.card,
      attack: this.action.params.attack,
      hp: this.action.params.hp
    });

    return this.applyModifierConditionally(modifier, { candidates: [] });
  }
}
