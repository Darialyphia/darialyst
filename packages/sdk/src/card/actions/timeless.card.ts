import { echo } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';

export class TimelessCardAction extends CardAction<'timeless'> {
  protected async executeImpl() {
    const cleanup = this.ctx.artifact?.addInterceptor(
      'shouldLoseDurabilityOnGeneralDamage',
      () => !this.session.playerSystem.activePlayer.equals(this.ctx.card.player)
    );

    return () => {
      cleanup?.();
    };
  }
}
