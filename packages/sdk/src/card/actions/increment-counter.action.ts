import { CardAction, noop } from './_card-action';

export class IncrementCounterCardAction extends CardAction<'increment_counter'> {
  async executeImpl() {
    if (!this.card.meta[this.action.params.name]) {
      this.card.meta[this.action.params.name] = 0;
    }
    this.card.meta[this.action.params.name]++;

    return noop;
  }
}
