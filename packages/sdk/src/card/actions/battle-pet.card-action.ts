import { battlePet } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';

export class BattlePetCardAction extends CardAction<'battle_pet'> {
  async executeImpl() {
    const modifier = battlePet({ source: this.card });

    return this.applyModifierConditionally(modifier, this.action.params.activeWhen);
  }
}
