import { wall } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';

export class WallCardAction extends CardAction<'wall'> {
  protected async executeImpl() {
    const modifier = wall({ source: this.card });

    return this.applyModifierConditionally(modifier);
  }
}
