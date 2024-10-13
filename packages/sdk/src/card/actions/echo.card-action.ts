import { echo } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';

export class EchoCardAction extends CardAction<'echo'> {
  protected async executeImpl() {
    const modifier = echo();

    this.card.addModifier(modifier);

    return () => {
      this.card.removeModifier(modifier.id);
    };
  }
}
