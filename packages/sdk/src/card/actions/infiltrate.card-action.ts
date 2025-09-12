import { infiltrate } from '../../modifier/modifier-utils';
import { CardAction } from './_card-action';
import type { Entity } from '../../entity/entity';
import { parseSerializedBlueprintEffect } from '../effect-parser';

export class InfiltrateCardAction extends CardAction<'infiltrate'> {
  async executeImpl() {
    const effects = parseSerializedBlueprintEffect({
      text: '',
      config: this.action.params.effect
    }).flat();

    const cleanupsByEntity = new Map<Entity, Array<() => void>>();

    const modifier = infiltrate({
      source: this.card,
      onApplied: async entity => {
        if (!cleanupsByEntity.has(entity)) {
          cleanupsByEntity.set(entity, []);
        }
        const cleanups = cleanupsByEntity.get(entity)!;
        for (const effect of effects) {
          if (effect.onPlay) {
            cleanups.push(
              await effect.onPlay({
                session: this.session,
                entity,
                card: entity.card,
                modifierRecipient: this.ctx.entity,
                targets: [],
                choice: 0
              })
            );
          }
          if (effect.getEntityModifier) {
            const mod = effect.getEntityModifier({
              session: this.session,
              entity,
              card: entity.card,
              modifierRecipient: this.ctx.entity,
              targets: [],
              choice: 0
            });
            entity.addModifier(mod);
            cleanups.push(() => {
              entity.removeModifier(mod.id);
            });
          }

          if (effect.getCardModifier) {
            const mod = effect.getCardModifier();
            entity.card.addModifier(mod);
            cleanups.push(() => {
              entity.removeModifier(mod.id);
            });
          }
        }
      },
      onRemoved(entity) {
        cleanupsByEntity.get(entity)?.forEach(cleanup => {
          cleanup();
        });
        cleanupsByEntity.set(entity, []);
      }
    });

    return this.applyModifierConditionally(modifier);
  }
}
