import { CardAction, noop } from './_card-action';

export class TransformUnitCardAction extends CardAction<'transform_unit'> {
  protected async executeImpl() {
    const blueprintId = this.getBlueprint(this.action.params.blueprint).id;
    await Promise.all(
      this.getUnits(this.action.params.unit).map(async unit => {
        const originalBlueprint = unit.card.blueprintId;
        await unit.transform(blueprintId);

        if (this.action.params.duration === 'end_of_turn') {
          this.session.playerSystem.activePlayer.once('turn_end', async () => {
            await unit.transform(originalBlueprint);
          });
        }
        if (this.action.params.duration === 'start_of_next_turn') {
          this.session.playerSystem.activePlayer.once('turn_start', async player => {
            if (player.equals(this.card.player)) {
              await unit.transform(originalBlueprint);
            }
          });
        }
      })
    );

    return noop;
  }
}
