import { stunned } from '../../modifier/modifier-utils';
import { KEYWORDS } from '../../utils/keywords';
import { CardAction } from './_card-action';

export class StunCardAction extends CardAction<'stun'> {
  protected async executeImpl() {
    const units = this.getUnits(this.action.params.target);

    units.forEach(target => {
      target.addModifier(stunned({ source: this.card }));
    });

    return () =>
      units.forEach(target => {
        target.removeModifier(KEYWORDS.ROOTED.id);
      });
  }
}
