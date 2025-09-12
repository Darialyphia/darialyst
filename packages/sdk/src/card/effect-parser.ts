import { match } from 'ts-pattern';
import { type CardModifier, createCardModifier } from '../modifier/card-modifier';
import { type EntityModifier, createEntityModifier } from '../modifier/entity-modifier';
import { whileOnBoard, whileEquipped, whileInHand } from '../modifier/modifier-utils';
import { Artifact } from './artifact';
import { parseCardAction, type ParsedActionResult } from './card-action';
import type { Trigger, TriggerFrequency } from './card-action-triggers';
import type { SerializedBlueprint, CardBlueprint } from './card-blueprint';
import type { GenericCardEffect, Action, VFXSequence } from './card-effect';
import type { EffectCtx } from './card-parser';
import { getCards } from './conditions/card-conditions';
import { getPlayers } from './conditions/player-condition';
import { getUnits } from './conditions/unit-conditions';
import { Unit } from './unit';
import { checkGlobalConditions } from './conditions/global-conditions';
import { isObject } from '@game/shared';
import type { GameEvent, GameEventMap } from '../game-session';
import {
  modifierGameEventMixin,
  modifierCardGameEventMixin
} from '../modifier/mixins/game-event.mixin';

export const playVFXSequence = (
  sequence: VFXSequence,
  ctx: EffectCtx,
  event?: any,
  eventName?: string
) => {
  return Promise.all(
    sequence.tracks.map(async track => {
      const shouldPlay = checkGlobalConditions(track.filter, ctx, event, eventName);
      if (!shouldPlay) return;

      for (const step of track.steps) {
        await match(step)
          .with({ type: 'wait' }, step => {
            return ctx.session.fxSystem.wait(step.params);
          })
          .with({ type: 'addLightOnEntity' }, step => {
            const entities = getUnits({
              ...ctx,
              event,
              eventName,
              conditions: step.params.entity
            });
            return Promise.all(
              entities.map(entity =>
                ctx.session.fxSystem.addLightOnEntity(entity, step.params)
              )
            );
          })
          .with({ type: 'playSfxOnEntity' }, step => {
            const entities = getUnits({
              ...ctx,
              event,
              eventName,
              conditions: step.params.entity
            });
            return Promise.all(
              entities.map(entity =>
                ctx.session.fxSystem.playSfxOnEntity(entity, step.params)
              )
            );
          })
          .with({ type: 'playSfxOnScreenCenter' }, step => {
            return ctx.session.fxSystem.playSfxOnScreenCenter(step.params);
          })
          .with({ type: 'shakeEntity' }, step => {
            const entities = getUnits({
              ...ctx,
              event,
              eventName,
              conditions: step.params.entity
            });
            return Promise.all(
              entities.map(entity =>
                ctx.session.fxSystem.shakeEntity(entity, step.params)
              )
            );
          })
          .with({ type: 'shakeScreen' }, step => {
            return ctx.session.fxSystem.shakeScreen(step.params);
          })
          .with({ type: 'tintEntity' }, step => {
            const entities = getUnits({
              ...ctx,
              event,
              eventName,
              conditions: step.params.entity
            });
            return Promise.all(
              entities.map(entity => ctx.session.fxSystem.tintEntity(entity, step.params))
            );
          })
          .with({ type: 'tintScreen' }, step => {
            return ctx.session.fxSystem.tintScreen(step.params);
          })
          .with({ type: 'bloomEntity' }, step => {
            const entities = getUnits({
              ...ctx,
              event,
              eventName,
              conditions: step.params.entity
            });

            return Promise.all(
              entities.map(entity =>
                ctx.session.fxSystem.bloomEntity(entity, step.params)
              )
            );
          })
          .with({ type: 'bloomScreen' }, step => {
            return ctx.session.fxSystem.bloomScreen(step.params);
          })
          .with({ type: 'shockwaveOnEntity' }, step => {
            const entities = getUnits({
              ...ctx,
              event,
              eventName,
              conditions: step.params.entity
            });

            return Promise.all(
              entities.map(entity =>
                ctx.session.fxSystem.shockwaveOnEntity(entity, step.params)
              )
            );
          })
          .with({ type: 'shockwaveOnScreenCenter' }, step => {
            return ctx.session.fxSystem.shockwaveOnScreenCenter(step.params);
          })
          .exhaustive();
      }
    })
  );
};

export const getEffectModifier = <T extends GameEvent>({
  filter,
  frequency,
  eventName,
  vfx,
  actions
}: {
  eventName: T;
  filter: (ctx: EffectCtx, event: GameEventMap[T], eventName: T) => boolean;
  actions: ParsedActionResult[];
  frequency: TriggerFrequency;
  vfx?: VFXSequence;
}) => {
  return {
    getEntityModifier: (ctx: EffectCtx) => {
      let occurences = 0;
      const resetCount = () => {
        occurences = 0;
      };
      ctx.session.on('player:turn_start', resetCount);
      const cleanups: Array<() => void> = [
        () => ctx.session.off('player:turn_start', resetCount)
      ];

      const INFINITE_LOOP_PREVENTION_MAX_OCCURENCES = 100;
      const maxOccurences = match(frequency)
        .with({ type: 'once' }, () => 1)
        .with({ type: 'n_per_turn' }, frequency => frequency.params.count)
        .with({ type: 'always' }, () => INFINITE_LOOP_PREVENTION_MAX_OCCURENCES)
        .exhaustive();

      return createEntityModifier({
        source: ctx.card,
        stackable: false,
        visible: false,
        mixins: [
          modifierGameEventMixin({
            eventName,
            async listener(event) {
              if (!filter(ctx, event, eventName)) return;
              if (occurences >= maxOccurences) return;

              if (vfx) {
                await playVFXSequence(vfx, ctx);
              }

              for (const action of actions) {
                const [eventPayload] = event;
                const cleanup = await action(
                  ctx,
                  isObject(eventPayload) ? eventPayload : {},
                  eventName
                );
                occurences++;
                cleanups.push(cleanup);
              }
            }
          }),
          {
            onRemoved(session) {
              return session.actionSystem.schedule(async () => {
                cleanups.forEach(cleanup => cleanup());
              });
            }
          }
        ]
      });
    },
    getCardModifier: () => {
      const cleanups: Array<() => void> = [];

      return createCardModifier({
        stackable: false,
        mixins: [
          modifierCardGameEventMixin({
            eventName,
            once: frequency.type === 'once',
            async listener(event, ctx) {
              const effectCtx = {
                session: ctx.session,
                card: ctx.attachedTo,
                targets: [],
                choice: 0
              };
              if (filter(effectCtx, event, eventName)) {
                if (vfx) {
                  await playVFXSequence(vfx, effectCtx);
                }

                for (const action of actions) {
                  const [eventPayload] = event;

                  const cleanup = await action(
                    effectCtx,
                    isObject(eventPayload) ? eventPayload : {},
                    eventName
                  );
                  cleanups.push(cleanup);
                }
              }
            }
          }),
          {
            onRemoved(session) {
              return session.actionSystem.schedule(async () => {
                cleanups.forEach(cleanup => cleanup());
              });
            }
          }
        ]
      });
    }
  };
};

export const getEffectCtxEntity = (ctx: EffectCtx) =>
  ctx.modifierRecipient ?? ctx.entity ?? ctx.card.player.general;

export const parseSerializedBlueprintEffect = (
  effect: SerializedBlueprint<GenericCardEffect[]>['effects'][number]
): Array<{
  onInit?: (blueprint: CardBlueprint) => void;
  onPlay?: (ctx: EffectCtx) => Promise<() => void>;
  getCardModifier?: () => CardModifier;
  getEntityModifier?: (ctx: EffectCtx) => EntityModifier;
}> => {
  return match(effect.config)
    .with({ executionContext: 'immediate' }, config => [
      {
        async onPlay(ctx: EffectCtx) {
          const actions = config.actions.map(parseCardAction);
          if (effect.vfx) {
            await playVFXSequence(effect.vfx, ctx);
          }
          const cleanups: any[] = [];
          for (const action of actions) {
            cleanups.push(await action(ctx, {}));
          }
          return () => {
            cleanups.forEach(c => c());
          };
        }
      }
    ])
    .with({ executionContext: 'while_on_board' }, config => [
      {
        async onPlay(ctx: EffectCtx) {
          const cleanups: Array<() => void> = [];
          const entity = getEffectCtxEntity(ctx);
          whileOnBoard({
            source: ctx.card,
            entity,
            async onApplied() {
              const actions = config.actions.map(parseCardAction);
              if (effect.vfx) {
                await playVFXSequence(effect.vfx, ctx);
              }
              for (const action of actions) {
                cleanups.push(await action(ctx, {}));
              }
            },
            async onRemoved() {
              await ctx.session.actionSystem.schedule(async () => {
                cleanups.forEach(cleanup => cleanup());
              });
            }
          });

          return () => {
            return ctx.session.actionSystem.schedule(async () => {
              cleanups.forEach(cleanup => cleanup());
            });
          };
        }
      }
    ])
    .with({ executionContext: 'while_equiped' }, config => [
      {
        async onPlay(ctx: EffectCtx) {
          if (effect.vfx) {
            await playVFXSequence(effect.vfx, ctx);
          }
          const cleanups: Array<() => void> = [];

          const modifier = createEntityModifier({
            source: ctx.card,
            stackable: false,
            visible: false,
            mixins: [
              {
                async onApplied() {
                  const actions = config.actions.map(parseCardAction);
                  if (effect.vfx) {
                    await playVFXSequence(effect.vfx, ctx);
                  }
                  for (const action of actions) {
                    cleanups.push(await action(ctx, {}));
                  }
                },
                async onRemoved() {
                  await ctx.session.actionSystem.schedule(async () => {
                    cleanups.forEach(cleanup => cleanup());
                  });
                }
              }
            ]
          });
          whileEquipped({
            artifact: ctx.artifact!,
            modifier
          });

          return () => {
            return ctx.session.actionSystem.schedule(async () => {
              cleanups.forEach(cleanup => cleanup());
            });
          };
        }
      }
    ])
    .with({ executionContext: 'while_in_hand' }, config => {
      return [
        {
          getCardModifier() {
            const cleanups: Array<() => void> = [];

            return createCardModifier({
              stackable: false,
              mixins: [
                {
                  onApplied(session, card) {
                    whileInHand(
                      card,
                      async () => {
                        const actions = config.actions.map(parseCardAction);

                        for (const action of actions) {
                          cleanups.push(
                            await action({ session, card, targets: [], choice: 0 }, {})
                          );
                        }
                      },
                      () => {
                        return session.actionSystem.schedule(async () => {
                          cleanups.forEach(cleanup => cleanup());
                        });
                      }
                    );
                  },
                  async onRemoved(session) {
                    await session.actionSystem.schedule(async () => {
                      cleanups.forEach(cleanup => cleanup());
                    });
                  }
                }
              ]
            });
          }
        }
      ];
    })
    .with(
      { executionContext: 'while_in_deck' },
      { executionContext: 'while_in_graveyard' },
      { executionContext: 'trigger_while_in_hand' },
      { executionContext: 'trigger_while_equiped' },
      { executionContext: 'trigger_while_on_board' },
      config => {
        const actions = (config.actions as Action[]).map(parseCardAction);
        return config.triggers.map((trigger: Trigger) =>
          match(trigger)
            .with({ type: 'on_before_card_played' }, trigger => {
              return getEffectModifier({
                eventName: 'card:before_played',
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                filter(ctx, [event], eventName) {
                  return trigger.params.card.candidates.length
                    ? getCards({
                        ...ctx,
                        conditions: trigger.params.card,
                        event,
                        eventName
                      }).some(card => event === card)
                    : true;
                }
              });
            })
            .with({ type: 'on_after_card_played' }, trigger => {
              return getEffectModifier({
                eventName: 'card:after_played',
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                filter(ctx, [event], eventName) {
                  event.blueprintId;
                  return trigger.params.card.candidates.length
                    ? getCards({
                        ...ctx,
                        conditions: trigger.params.card,
                        event,
                        eventName
                      }).some(card => event === card)
                    : true;
                }
              });
            })
            .with({ type: 'on_before_player_draw' }, trigger => {
              return getEffectModifier({
                eventName: 'player:before_draw',
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                filter(ctx, [event], eventName) {
                  return trigger.params.player.candidates.length
                    ? getPlayers({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.player
                      }).some(player => player.equals(event.player))
                    : true;
                }
              });
            })
            .with({ type: 'on_after_player_draw' }, trigger => {
              return getEffectModifier({
                eventName: 'player:after_draw',
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                filter(ctx, [event], eventName) {
                  return trigger.params.player.candidates.length
                    ? getPlayers({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.player
                      }).some(player => player.equals(event.player))
                    : true;
                }
              });
            })
            .with({ type: 'on_before_player_replace' }, trigger => {
              return getEffectModifier({
                eventName: 'player:before_replace',
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                filter(ctx, [event], eventName) {
                  return trigger.params.player.candidates.length
                    ? getPlayers({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.player
                      }).some(player => player.equals(event.player))
                    : true;
                }
              });
            })
            .with({ type: 'on_after_player_replace' }, trigger => {
              return getEffectModifier({
                eventName: 'player:after_replace',
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                filter(ctx, [event], eventName) {
                  return trigger.params.player.candidates.length
                    ? getPlayers({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.player
                      }).some(player => player.equals(event.player))
                    : true;
                }
              });
            })
            .with({ type: 'on_before_unit_move' }, trigger => {
              return getEffectModifier({
                actions,
                frequency: trigger.params.frequency,
                vfx: effect.vfx,
                eventName: 'entity:before_move',
                filter(ctx, [event], eventName) {
                  return trigger.params.unit.candidates.length
                    ? getUnits({
                        ...ctx,
                        conditions: trigger.params.unit,
                        event,
                        eventName
                      }).some(entity => entity.equals(event.entity))
                    : true;
                }
              });
            })
            .with({ type: 'on_after_unit_move' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:after_move',
                filter(ctx, [event], eventName) {
                  return trigger.params.unit.candidates.length
                    ? getUnits({
                        ...ctx,
                        conditions: trigger.params.unit,
                        event,
                        eventName
                      }).some(entity => entity.equals(event.entity))
                    : true;
                }
              });
            })
            .with({ type: 'on_before_unit_teleport' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:before_teleport',
                filter(ctx, [event], eventName) {
                  return trigger.params.unit.candidates.length
                    ? getUnits({
                        ...ctx,
                        conditions: trigger.params.unit,
                        event,
                        eventName
                      }).some(entity => entity.equals(event.entity))
                    : true;
                }
              });
            })
            .with({ type: 'on_after_unit_teleport' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:after_teleport',
                filter(ctx, [event], eventName) {
                  return trigger.params.unit.candidates.length
                    ? getUnits({
                        ...ctx,
                        conditions: trigger.params.unit,
                        event,
                        eventName
                      }).some(entity => entity.equals(event.entity))
                    : true;
                }
              });
            })
            .with({ type: 'on_before_unit_attack' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:before_attack',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.unit.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.entity))
                      : true) &&
                    (trigger.params.target.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.target,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.target))
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_after_unit_attack' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:after_attack',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.unit.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.entity))
                      : true) &&
                    (trigger.params.target.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.target,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.target))
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_before_unit_healed' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:before_heal',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.unit?.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.entity))
                      : true) &&
                    (trigger.params.card?.candidates.length
                      ? getCards({
                          ...ctx,
                          conditions: trigger.params.card,
                          event,
                          eventName
                        }).some(card => {
                          event.source.equals(card);
                        })
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_after_unit_healed' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:after_heal',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.unit?.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.entity))
                      : true) &&
                    (trigger.params.card?.candidates.length
                      ? getCards({
                          ...ctx,
                          conditions: trigger.params.card,
                          event,
                          eventName
                        }).some(card => {
                          event.source.equals(card);
                        })
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_before_unit_take_damage' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:before_take_damage',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.card?.candidates.length
                      ? getCards({
                          ...ctx,
                          conditions: trigger.params.card,
                          event,
                          eventName
                        }).some(card => {
                          event.source.equals(card);
                        })
                      : true) &&
                    (trigger.params.unit?.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => {
                          if (!(event.source instanceof Unit)) return false;
                          event.source.entity.equals(entity);
                        })
                      : true) &&
                    (trigger.params.target.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.target,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.entity))
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_after_unit_take_damage' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:after_take_damage',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.card?.candidates.length
                      ? getCards({
                          ...ctx,
                          conditions: trigger.params.card,
                          event,
                          eventName
                        }).some(card => {
                          event.source.equals(card);
                        })
                      : true) &&
                    (trigger.params.unit?.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => {
                          if (!(event.source instanceof Unit)) return false;
                          event.source.entity.equals(entity);
                        })
                      : true) &&
                    (trigger.params.target.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.target,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.entity))
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_before_unit_deal_damage' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:before_deal_damage',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.unit.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => event.entity.equals(entity))
                      : true) &&
                    (trigger.params.target.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.target,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.target))
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_after_unit_deal_damage' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:after_deal_damage',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.unit.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => event.entity.equals(entity))
                      : true) &&
                    (trigger.params.target.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.target,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.target))
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_before_unit_retaliate' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:before_retaliate',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.unit.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.entity))
                      : true) &&
                    (trigger.params.target.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.target,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.target))
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_after_unit_retaliate' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:after_retaliate',
                filter(ctx, [event], eventName) {
                  return (
                    (trigger.params.unit.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.unit,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.entity))
                      : true) &&
                    (trigger.params.target.candidates.length
                      ? getUnits({
                          ...ctx,
                          conditions: trigger.params.target,
                          event,
                          eventName
                        }).some(entity => entity.equals(event.target))
                      : true)
                  );
                }
              });
            })
            .with({ type: 'on_unit_play' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:created',
                filter(ctx, [event], eventName) {
                  return trigger.params.unit.candidates.length
                    ? getUnits({
                        ...ctx,
                        conditions: trigger.params.unit,
                        event,
                        eventName
                      }).some(entity => entity.equals(event))
                    : true;
                }
              });
            })
            .with({ type: 'on_unit_after_play' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:after_created',
                filter(ctx, [event], eventName) {
                  return trigger.params.unit.candidates.length
                    ? getUnits({
                        ...ctx,
                        conditions: trigger.params.unit,
                        event,
                        eventName
                      }).some(entity => entity.equals(event))
                    : true;
                }
              });
            })
            .with({ type: 'on_before_unit_destroyed' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:before_destroy',
                filter(ctx, [event], eventName) {
                  return trigger.params.unit.candidates.length
                    ? getUnits({
                        ...ctx,
                        conditions: trigger.params.unit,
                        event,
                        eventName
                      }).some(entity => entity.equals(event))
                    : true;
                }
              });
            })
            .with({ type: 'on_after_unit_destroyed' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'entity:after_destroy',
                filter(ctx, [event], eventName) {
                  return trigger.params.unit.candidates.length
                    ? getUnits({
                        ...ctx,
                        conditions: trigger.params.unit,
                        event,
                        eventName
                      }).some(entity => entity.equals(event))
                    : true;
                }
              });
            })
            .with({ type: 'on_card_drawn' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'card:drawn',
                filter(ctx, [event], eventName) {
                  return trigger.params.card.candidates.length
                    ? getCards({
                        ...ctx,
                        conditions: trigger.params.card,
                        event,
                        eventName
                      }).some(card => card === event)
                    : true;
                }
              });
            })
            .with({ type: 'on_card_replaced' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'card:replaced',
                filter(ctx, [event], eventName) {
                  return trigger.params.card.candidates.length
                    ? getCards({
                        ...ctx,
                        conditions: trigger.params.card,
                        event,
                        eventName
                      }).some(card => card === event)
                    : true;
                }
              });
            })
            .with({ type: 'on_player_turn_start' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'player:turn_start',
                filter(ctx, [event], eventName) {
                  return trigger.params.player.candidates.length
                    ? getPlayers({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.player
                      }).some(player => player.equals(event))
                    : true;
                }
              });
            })
            .with({ type: 'on_player_turn_end' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'player:turn_end',
                filter(ctx, [event], eventName) {
                  return trigger.params.player.candidates.length
                    ? getPlayers({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.player
                      }).some(player => player.equals(event))
                    : true;
                }
              });
            })
            .with({ type: 'on_artifact_equiped' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'artifact:equiped',
                filter(ctx, [event], eventName) {
                  return trigger.params.card.candidates.length
                    ? getCards({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.card
                      }).some(card => {
                        return card instanceof Artifact && event.card.equals(card);
                      })
                    : true;
                }
              });
            })
            .with({ type: 'on_artifact_destroyed' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'artifact:before_destroy',
                filter(ctx, [event], eventName) {
                  return trigger.params.card.candidates.length
                    ? getCards({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.card
                      }).some(card => card instanceof Artifact && event.card.equals(card))
                    : true;
                }
              });
            })
            .with({ type: 'on_before_artifact_lose_durability' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'artifact:before_lose_durability',
                filter(ctx, [event], eventName) {
                  return trigger.params.card.candidates.length
                    ? getCards({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.card
                      }).some(card => card instanceof Artifact && event.card.equals(card))
                    : true;
                }
              });
            })
            .with({ type: 'on_after_artifact_lose_durability' }, trigger => {
              return getEffectModifier({
                actions,
                vfx: effect.vfx,
                frequency: trigger.params.frequency,
                eventName: 'artifact:after_lose_durability',
                filter(ctx, [event], eventName) {
                  return trigger.params.card.candidates.length
                    ? getCards({
                        ...ctx,
                        event,
                        eventName,
                        conditions: trigger.params.card
                      }).some(card => card instanceof Artifact && event.card.equals(card))
                    : true;
                }
              });
            })
            .exhaustive()
        );
      }
    )
    .exhaustive();
};
