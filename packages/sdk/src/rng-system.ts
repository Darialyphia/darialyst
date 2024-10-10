import { isDefined } from '@game/shared';
import randoomSeed from 'seedrandom';

export type RngSystem = {
  nextInt(max: number): number;
  next(): number;
  serialize(): {
    values: number[];
  };
  values: number[];
  seed: string;
};

export class ServerRngSystem implements RngSystem {
  private rng: randoomSeed.PRNG;
  private _values: number[] = [];

  constructor(public readonly seed: string) {
    this.rng = randoomSeed(this.seed);
    this.next = this.next.bind(this);
  }

  get values() {
    return [...this._values];
  }

  set values(val) {
    this._values = val;
  }

  next() {
    const val = this.rng();
    this._values.push(val);
    return val;
  }

  nextInt(max: number) {
    return Math.floor(this.next() * (max + 1));
  }

  serialize() {
    return { values: [...this._values] };
  }
}

export class MissingRngError extends Error {}

export class ClientRngSystem implements RngSystem {
  values: number[] = [];
  seed = '';

  private rng() {
    const val = this.values.shift();
    if (!isDefined(val)) throw new MissingRngError('Missing rng value');

    return val;
  }

  nextInt(max: number) {
    return Math.floor(this.next() * (max + 1));
  }

  next() {
    return this.rng();
  }

  serialize() {
    return {
      values: []
    };
  }
}
