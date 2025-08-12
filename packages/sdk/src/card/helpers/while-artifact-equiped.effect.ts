import type { TriggerFrequency } from '../card-action-triggers';
import { type Action, type OverridesFromTrigger, defineCardEffect } from '../card-effect';

export const whileArtifactEquipedEffect = ({
  text,
  actions
}: {
  text: string;
  actions: Action<
    OverridesFromTrigger<
      [
        {
          type: 'on_artifact_equiped';
          params: {
            frequency: TriggerFrequency;
            card: {
              candidates: [
                [
                  {
                    type: 'self';
                  }
                ]
              ];
            };
          };
        }
      ]
    >
  >[];
}) =>
  defineCardEffect({
    text,
    config: {
      executionContext: 'trigger_while_equiped',
      triggers: [
        {
          type: 'on_artifact_equiped',
          params: {
            frequency: { type: 'always' },
            card: { candidates: [[{ type: 'self' }]] }
          }
        }
      ],
      actions
    }
  });
