import { shuffleArray } from '@game/shared';
import { discover } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';

const MAX_CHOICES = 3;
export class DiscoverCardAction extends CardAction<'discover'> {
  protected async executeImpl() {
    const blueprints = this.getBlueprints(this.action.params.blueprints);

    const modifier = discover({
      choices: blueprints
    });

    this.card.addModifier(modifier);

    return () => {
      this.card.removeModifier(modifier.id);
    };
  }
}
