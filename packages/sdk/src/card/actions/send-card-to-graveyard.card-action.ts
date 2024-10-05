import { CardAction, noop } from './_card-action';

export class SendCardToGraveyardCardAction extends CardAction<'send_card_to_graveyard'> {
  protected async executeImpl() {
    const cards = this.getCards(this.action.params.card);
    this.getPlayers(this.action.params.player).forEach(player => {
      cards.forEach(card => {
        if (!card.player.equals(player)) return;
        player.discard(card);
      });
    });

    return noop;
  }
}
