import { CardAction, noop } from './_card-action';

export class SetCounterCardAction extends CardAction<'set_counter'> {
  async executeImpl() {
    this.card.meta[this.action.params.name] = this.getAmount(
      this.action.params.counterValue
    );

    return noop;
  }
}
