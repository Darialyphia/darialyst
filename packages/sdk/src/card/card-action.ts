import { match } from 'ts-pattern';
import type { Action, NumericOperator } from './card-effect';
import { type AnyObject, type Constructor } from '@game/shared';
import { type EffectCtx } from './card-parser';
import { DealDamageCardAction } from './actions/deal-damage.card-action';
import { HealCardAction } from './actions/heal.card-action';
import { DrawCardAction } from './actions/draw.card-action';
import { ChangeStatsCardAction } from './actions/change-stats.card-action';
import { ChangeDamageTakenAction } from './actions/change-damage-taken.card-action';
import { ChangeHealReceivedAction } from './actions/change-heal-received.card-action';
import { ChangeDamageDealtAction } from './actions/change-damage-dealt.card-action';
import { ProvokeCardAction } from './actions/provoke.card-action';
import { BackstabCardAction } from './actions/backstab.card-action';
import { AddEffectCardAction } from './actions/add-effect.card-action';
import { ZealCardAction } from './actions/zeal.card-action';
import { DestroyUnitCardAction } from './actions/destroy-unit.card-action';
import { BounceUnitCardAction } from './actions/bounce-unit.card-action';
import { DispelCellCardAction } from './actions/dispel-cell.card-action';
import { ActivateUnitCardAction } from './actions/activate-unit.card-action';
import { ChangeCardCostCardAction } from './actions/change-card-cost.card-action';
import { RangedCardAction } from './actions/ranged.card-action';
import { GenerateCardCardAction } from './actions/generate-card.card-action';
import { TeleportCardAction } from './actions/teleport.card-action';
import { SwapUnitsCardAction } from './actions/swapUnits.card-action';
import { CelerityCardAction } from './actions/celerity.card-action';
import { ChangeReplaceCountCardAction } from './actions/change-replaces-count.card-action';
import { RushCardAction } from './actions/rush.card-action';
import { AirdropCardAction } from './actions/airdrop.card-action';
import { FlyingCardAction } from './actions/flying.card-action';
import { PlayCardCardAction } from './actions/play-card.card-action';
import { FrenzyCardAction } from './actions/frenzy.card-action';
import { EphemeralCardAction } from './actions/ephemeral.card-action';
import { StructureCardAction } from './actions/structure.card-action';
import { SpawnCardAction } from './actions/spawn.card-action';
import { RemoveKeywordCardActon } from './actions/remove-keyword.card-action';
import { EquipArtifactCardAction } from './actions/equip-artifact.card-action';
import { SummonUnitCardAction } from './actions/summon-unit.card-action';
import { ChangeCardOwnerCardAction } from './actions/change-unit-owner.card-action';
import { BlastCardAction } from './actions/blast.card-action';
import { ChangeCanAttackCardAction } from './actions/change-can-attack.card-action';
import { DispelEntityCardAction } from './actions/dispel-entity.card-action';
import { AuraCardAction } from './actions/aura.card-action';
import { UnequipArtifactCardAction } from './actions/unequip-artifact.card-action';
import { CleanseEntityCardAction } from './actions/cleanse-entity.card-action';
import { ElusiveCardAction } from './actions/elusive.card-action';
import { EssenceCardAction } from './actions/essence.card-action';
import { FearsomeCardAction } from './actions/fearsome.card-action';
import { CreateTileCardAction } from './actions/create_tile.card-action';
import { SlayCardAction } from './actions/slay.card-action';
import { GiveGoldCardAction } from './actions/give-gold.card-action';
import { ChangeCanBeAttackedCardAction } from './actions/change-can-be-attacked.card-action';
import { TransformUnitCardAction } from './actions/transform-unit.card-action';
import { BarrierCardAction } from './actions/barrier.card-action';
import { GrowCardAction } from './actions/grow.card-action';
import { RebirthCardAction } from './actions/rebirth.card-action';
import { AdaptCardAction } from './actions/adapt.card-action';
import { ToughCardAction } from './actions/tough.card-action';
import { VulnerableCardAction } from './actions/vulnerable.card-action';
import { SendCardToGraveyardCardAction } from './actions/send-card-to-graveyard.card-action';
import { RootCardAction } from './actions/root.card-action';
import { ChangeCanRetaliateCardAction } from './actions/change-can-retaliate.action';
import { StunCardAction } from './actions/stun.card-action';
import { FreezeCardAction } from './actions/freeze.card-action';
import { VeilCardAction } from './actions/veil.card-action';
import { WallCardAction } from './actions/wall.card-action';
import { InfiltrateCardAction } from './actions/infiltrate.card-action';
import { BattlePetCardAction } from './actions/battle-pet.card-action';
import { DiscoverCardAction } from './actions/discover.card-action';
import { EchoCardAction } from './actions/echo.card-action';
import type { CardAction } from './actions/_card-action';
import { TimelessCardAction } from './actions/timeless.card';

export type ParsedActionResult = (
  ctx: EffectCtx,
  event: AnyObject,
  eventName?: string
) => Promise<() => void>;

export const matchNumericOperator = (
  amount: number,
  reference: number,
  operator: NumericOperator
) => {
  return match(operator)
    .with('equals', () => amount === reference)
    .with('less_than', () => amount < reference)
    .with('more_than', () => amount > reference)
    .exhaustive();
};

const ACTION_DICTIONARY: {
  [Type in Action['type']]: Constructor<CardAction<Type>>;
} = {
  activate_unit: ActivateUnitCardAction,
  adapt: AdaptCardAction,
  add_effect: AddEffectCardAction,
  airdrop: AirdropCardAction,
  aura: AuraCardAction,
  backstab: BackstabCardAction,
  barrier: BarrierCardAction,
  battle_pet: BattlePetCardAction,
  blast: BlastCardAction,
  bounce_unit: BounceUnitCardAction,
  celerity: CelerityCardAction,
  change_can_attack: ChangeCanAttackCardAction,
  change_can_be_attacked: ChangeCanBeAttackedCardAction,
  change_can_retaliate: ChangeCanRetaliateCardAction,
  change_card_cost: ChangeCardCostCardAction,
  change_damage_dealt: ChangeDamageDealtAction,
  change_damage_taken: ChangeDamageTakenAction,
  change_heal_received: ChangeHealReceivedAction,
  change_replaces_count: ChangeReplaceCountCardAction,
  change_stats: ChangeStatsCardAction,
  change_unit_owner: ChangeCardOwnerCardAction,
  cleanse_entity: CleanseEntityCardAction,
  create_tile: CreateTileCardAction,
  deal_damage: DealDamageCardAction,
  destroy_unit: DestroyUnitCardAction,
  discover: DiscoverCardAction,
  dispel_cell: DispelCellCardAction,
  dispel_entity: DispelEntityCardAction,
  draw_cards: DrawCardAction,
  echo: EchoCardAction,
  elusive: ElusiveCardAction,
  ephemeral: EphemeralCardAction,
  equip_artifact: EquipArtifactCardAction,
  essence: EssenceCardAction,
  fearsome: FearsomeCardAction,
  flying: FlyingCardAction,
  freeze: FreezeCardAction,
  frenzy: FrenzyCardAction,
  generate_card: GenerateCardCardAction,
  give_gold: GiveGoldCardAction,
  grow: GrowCardAction,
  heal: HealCardAction,
  infiltrate: InfiltrateCardAction,
  play_card: PlayCardCardAction,
  provoke: ProvokeCardAction,
  ranged: RangedCardAction,
  rebirth: RebirthCardAction,
  remove_keyword: RemoveKeywordCardActon,
  root: RootCardAction,
  rush: RushCardAction,
  send_card_to_graveyard: SendCardToGraveyardCardAction,
  slay: SlayCardAction,
  spawn: SpawnCardAction,
  structure: StructureCardAction,
  stun: StunCardAction,
  summon_unit: SummonUnitCardAction,
  swap_units: SwapUnitsCardAction,
  teleport_unit: TeleportCardAction,
  tough: ToughCardAction,
  transform_unit: TransformUnitCardAction,
  unequip_artifact: UnequipArtifactCardAction,
  veil: VeilCardAction,
  vulnerable: VulnerableCardAction,
  wall: WallCardAction,
  zeal: ZealCardAction,
  timeless: TimelessCardAction
};

export const parseCardAction = (action: Action): ParsedActionResult => {
  return (ctx, event, eventName) => {
    const ctor = ACTION_DICTIONARY[action.type];
    const instance = new ctor(action, ctx, event, eventName) as CardAction<any>;

    return instance.execute();
  };
};
