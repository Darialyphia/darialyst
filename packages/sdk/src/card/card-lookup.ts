import { keyBy } from 'lodash-es';
import type { CardBlueprintId } from './card';
import type { GenericSerializedBlueprint, SerializedBlueprint } from './card-blueprint';
import { f1General } from './cards/faction_1/general';
import { f2General } from './cards/faction_2/general';
import { neutralHealingMystic } from './cards/neutral/healing_mystic';
import { neutralRiftWalker } from './cards/neutral/rift_walker';
import { f1TrueStrike } from './cards/faction_1/true_strike';
import { f1SunstoneBracers } from './cards/faction_1/sunstone_bracers';
import { f1WindbladeAdept } from './cards/faction_1/windblade_adept';
import { neutralPrimusShieldMaster } from './cards/neutral/primus-shieldmaster';
import { f1SilverguardKnight } from './cards/faction_1/silverguard_knight';
import { f1AzuriteLion } from './cards/faction_1/azurite_lion';
import { f1Martyrdom } from './cards/faction_1/martyrdom';
import { f1LionheartBlessing } from './cards/faction_1/lionheart_blessing';
import { f1IroncliffeGuardian } from './cards/faction_1/ironcliffe_guardian';
import { f1SilverguardSquire } from './cards/faction_1/silverguard_squire';
import { f1ArclyteSentinel } from './cards/faction_1/arclyte_sentinel';
import { f1Lightchaser } from './cards/faction_1/lightchaser';
import { f1Sunriser } from './cards/faction_1/sunriser';
import { f1SuntideMaiden } from './cards/faction_1/suntide_mainden';
import { f1LysianBrawler } from './cards/faction_1/lysian_brawler';
import { f1SecondSun } from './cards/faction_1/second_sun';
import { f1Tempest } from './cards/faction_1/tempest';
import { f1HolyImmolation } from './cards/faction_1/holy_immolation';
import { f1DivineBond } from './cards/faction_1/divine_bond';
import { f1SundropElixir } from './cards/faction_1/sundrop_elixir';
import { f1LastingJudgement } from './cards/faction_1/lasting_judgment';
import { f1ArclyteRegalia } from './cards/faction_1/arclyte_regalia';
import { f1CircleOfLife } from './cards/faction_1/circle_of_life';
import { f1WarSurge } from './cards/faction_1/war_surge';
import { f1SunBloom } from './cards/faction_1/sun_bloom';
import { f1ElyxStormblade } from './cards/faction_1/elyx_stormBlade';
import { f2InnerFocus } from './cards/faction_2/inner_focus';
import { f2KaidoAssassin } from './cards/faction_2/kaido_assassin';
import { f2TuskBoar } from './cards/faction_2/tusk_boar';
import { f2ManaVortex } from './cards/faction_2/mana_vortex';
import { f2ChakriAvatar } from './cards/faction_2/chakri_avatar';
import { f2CelestialPhantom } from './cards/faction_2/celestial_phantom';
import { f2Rythmweaver } from './cards/faction_2/rythmweaver';
import { f2KeshraiFanblade } from './cards/faction_2/keshrai_fanblade';
import { f2HammonBladeseeker } from './cards/faction_2/hammon_bladeseeker';
import { f2Gorehorn } from './cards/faction_2/gorehorn';
import { f2Heartseeker } from './cards/faction_2/heartseeker';
import { f2FourWindsMagus } from './cards/faction_2/four_winds_magus';
import { f2PhoenixFire } from './cards/faction_2/phoenix_fire';
import { f2SpiralTechnique } from './cards/faction_2/spiral_technique';
import { f2LanternFox } from './cards/faction_2/lantern_fox';
import { f2GhostLightning } from './cards/faction_2/ghost_lightning';
import { f2Gotatsu } from './cards/faction_2/gotatsu';
import { f2HeavensEclipse } from './cards/faction_2/heavens_eclipse';
import { f2KillingEdge } from './cards/faction_2/killing_edge';
import { f2SaberspineSeal } from './cards/faction_2/saberspine_seal';
import { f2MistDragonSeal } from './cards/faction_2/mist_dragon_seal';
import { f2Juxtaposition } from './cards/faction_2/juxtaposition';
import { f1Magnetize } from './cards/faction_1/magnetize';
import { f2KageLightning } from './cards/faction_2/kage_lightning';
import { f2StormKage } from './cards/faction_2/storm_kage';
import { neutralArakiHeadhunter } from './cards/neutral/araki_headhunter';
import { neutralAethermaster } from './cards/neutral/aethermaster';
import { f2Widowmaker } from './cards/faction_2/widowmaker';
import { neutralRepulsorBeast } from './cards/neutral/repulsor_beast';
import { f2JadeMonk } from './cards/faction_2/jade_monk';
import { f2ScarletViper } from './cards/faction_2/scarlet_viper';
import { neutralDreamgazer } from './cards/neutral/dreamgazer';
import { neutralEphemeralShroud } from './cards/neutral/ephemeral_shroud';
import { neutralDancingBlades } from './cards/neutral/dancing-blades';
import { neutralValeHunter } from './cards/neutral/vale-hunter';
import { neutralPutridMindflayer } from './cards/neutral/putrid_mindflayer';
import { neutralSaberspineTiger } from './cards/neutral/saberspine-tiger';
import { neutralProphetOfTheWhitePalm } from './cards/neutral/prophet_of_the_white_palm';
import { neutralBloodtearAlchemist } from './cards/neutral/bloodtear-alchemist';
import { neutralPrimusFist } from './cards/neutral/primus-first';
import { neutralVenomToth } from './cards/neutral/venom-toth';
import { neutralBonereaper } from './cards/neutral/bone-reaper';
import { neutralWingsOfParadise } from './cards/neutral/wings_of_paradise';
import { neutralPiercingMantis } from './cards/neutral/piercing-mantis';
import { neutralArchonSpellbinder } from './cards/neutral/archon-spellbinder';
import { neutralLightbender } from './cards/neutral/lightbender';
import { neutralFlamebloodWarlock } from './cards/neutral/flameblood_warlock';
import { neutralAzureHornShaman } from './cards/neutral/azure-horn-shaman';
import { neutralFrostboneNaga } from './cards/neutral/frostbone-naga';
import { f3General2 } from './cards/faction_3/general2';
import { f3WindDervish } from './cards/faction_3/wind-dervish';
import { f3EtherealObelysk } from './cards/faction_3/ethereal-obelysk';
import { f3PortalGuardian } from './cards/faction_3/portal-guardiant';
import { f3AymaraHealer } from './cards/faction_3/aymara_healer';
import { f3Chronomancer } from './cards/faction_3/chronomancer';
import { f3Dunecaster } from './cards/faction_3/dunecaster';
import { f3SandHowler } from './cards/faction_3/sand-howler';
import { f3StaffOfYkir } from './cards/faction_3/staff-of-ykir';
import { f3WindShrike } from './cards/faction_3/wind-shrike';
import { f3Blindscorch } from './cards/faction_3/blindscorch';
import { f3StarsFury } from './cards/faction_3/stars_fury';
import { f3ZenuiTheBlghtspawned } from './cards/faction_3/zenrui-the-blightspawned';
import { f3ScionsFirstWish } from './cards/faction_3/scions-first-wish';
import { f3ScionssSecondWish } from './cards/faction_3/scions-second-wish';
import { f3ScionsThirdWish } from './cards/faction_3/scions-third-wish';
import { f3BoneSwarm } from './cards/faction_3/boneswarm';
import { neutralSyvrelTheExile } from './cards/neutral/syvrel-the-exile';
import { neutralMiniJax } from './cards/neutral/mini-jax';
import { neutralJaxTruesight } from './cards/neutral/jax-truesight';
import { neutralTombstone } from './cards/neutral/tombstone';
import { neutralDioltas } from './cards/neutral/dioltas';
import { f3OrbWeaver } from './cards/faction_3/orb-weaver';
import { f3Pyromancer } from './cards/faction_3/pyromancer';
import { f3FusionBanshee } from './cards/faction_3/fusion-banshee';
import { f3StarfireScarab } from './cards/faction_3/starfire-scarab';
import { neutralRedSynja } from './cards/neutral/red-synja';
import { neutralLuxIgnis } from './cards/neutral/lux-ignis';
import { neutralEmeraldRejuvenator } from './cards/neutral/emeral_rejuvenator';
import { f1SunstoneTemplar } from './cards/faction_1/sunstone-templar';
import { neutralSwornAvenger } from './cards/neutral/sworn-avenger';
import { neutralVoidHunter } from './cards/neutral/void-hunter';
import { f3FireblazeObelisk } from './cards/faction_3/fireblaze-obelisk';
import { neutralSpellspark } from './cards/neutral/spellspark';
import { neutralFlameAcolyte } from './cards/neutral/flame-acolyte';
import { neutralJaxi } from './cards/neutral/jaxi';
import { f3SiphonEnergy } from './cards/faction_3/siphon-energy';
import { neutralGhostLynx } from './cards/neutral/ghost-lynx';
import { f3InnerOasis } from './cards/faction_3/inner-oasis';
import { f3CosmicFlesh } from './cards/neutral/cosmic_flesh';
import { f3DominateWill } from './cards/faction_3/dominate-will';
import { f3EntropicDecay } from './cards/faction_3/entropic-decay';
import { f3RashasCurse } from './cards/faction_3/rashas_curse';
import { f3FountainOfYouth } from './cards/faction_3/fountain_of_youth';
import { f3Hexblade } from './cards/faction_3/hexblade';
import { f1General2 } from './cards/faction_1/general2';
import { f1General3 } from './cards/faction_1/general3';
import { f2General2 } from './cards/faction_2/general2';
import { f2General3 } from './cards/faction_2/general3';
import { f3General } from './cards/faction_3/general';
import { f3General3 } from './cards/faction_3/general3';
import { f4General } from './cards/faction_4/general';
import { f4General2 } from './cards/faction_4/general2';
import { f4General3 } from './cards/faction_4/general3';
import { f5General } from './cards/faction_5/general';
import { f5General2 } from './cards/faction_5/general2';
import { f5General3 } from './cards/faction_5/general3';
import { f6General } from './cards/faction_6/general';
import { f6General2 } from './cards/faction_6/general2';
import { f6General3 } from './cards/faction_6/general3';
import { neutralPandora } from './cards/neutral/pandora';
import { neutralPandoraBlue } from './cards/neutral/pandora-blue';
import { neutralPandoraGreen } from './cards/neutral/pandora-green';
import { neutralPandoraPurple } from './cards/neutral/pandora-purple';
import { neutralPandoraRed } from './cards/neutral/pandora-red';
import { neutralPandoraYellow } from './cards/neutral/pandora-yellow';
import { f4Wraithling } from './cards/faction_4/wraithling';
import { f4ShadowDancer } from './cards/faction_4/shadow-dancer';
import { f4BloodmoonPriestess } from './cards/faction_4/bloodmoon-priestess';
import { f4BloodSiren } from './cards/faction_4/blood-siren';
import { f4NightsorrowAssassin } from './cards/faction_4/nightsorrow-assassin';
import { f4ShadowWatcher } from './cards/faction_4/shadow-watcher';
import { f4VorpalReaver } from './cards/faction_4/vorpal-reaver';
import { f4AbyssalCrawler } from './cards/faction_4/abyssal-crawler';
import { f4ReaperOfTheNineMoons } from './cards/faction_4/reaper-of-the-nine-moons';
import { neutralPaddo } from './cards/neutral/paddo';
import { f4SoulScythe } from './cards/faction_4/soul-scythe';
import { f4Gloomchaser } from './cards/faction_4/gloomchaser';
import { f4BlackSolus } from './cards/faction_4/black-solus';
import { f4SpectralRevenant } from './cards/faction_4/spectral-revenant';
import { f3TimeMaelstrom } from './cards/faction_3/time-maelstrom';
import { f3AurorasTears } from './cards/faction_3/auroras-tears';
import { f4GraspOfAgony } from './cards/faction_4/grasp-of-agony';
import { f4WraithlingSwarm } from './cards/faction_4/wraithling-swarm';
import { f4SphereOfDarkness } from './cards/faction_4/sphere-of-darkness';
import { f4DaemonicLure } from './cards/faction_4/daemonic-lure';
import { f4DarkSeed } from './cards/faction_4/dark-seed';
import { f4VoidPulse } from './cards/faction_4/void-pulse';
import { f4ShadowNova } from './cards/faction_4/shadow-nova';
import { f4BreathOfTheUnborn } from './cards/faction_4/breath-of-the-unborn';
import { f4DarkReflection } from './cards/faction_4/dark-reflection';
import { f4DarkTransormation } from './cards/faction_4/dark-terminus';
import { f4DarkfireSacrifice } from './cards/faction_4/darkfire-sacrifice';
import { f4DarkfireCrescendo } from './cards/faction_4/darkfire-crescendo';
import { f4RitualBanishing } from './cards/faction_4/ritual-banishing';
import { f4SoulshatterPact } from './cards/faction_4/soulshatter-pact';
import { f4RiteOfTheUndervault } from './cards/faction_4/rite-of-the-undervault';
import { f2MaskOfShadows } from './cards/faction_2/mask-of-shadows';
import { f4SpectralBlade } from './cards/faction_4/spectral-blade';
import { f4SoulGrimoire } from './cards/faction_4/soul-grimoire';
import { f4HornOfTheForsaken } from './cards/faction_4/horn-of-the-forsaken';
import { f2Panddo } from './cards/faction_2/panddo';
import { f2OnyxBearSeal } from './cards/faction_2/onyx-bear-seal';
import { f2CycloneMask } from './cards/faction_2/cyclone-mask';
import { f2MistWalking } from './cards/faction_2/mist-walking';
import { f1Decimate } from './cards/faction_1/decimate';
import { f1AegisBarrier } from './cards/faction_1/aegis-barrier';
import { f1SkywindGlaives } from './cards/faction_1/skywind-glaives';
import { f5MakantorWarbeast } from './cards/faction_5/makantor-warbeast';
import { f5Kujata } from './cards/faction_5/kujata';
import { f5Egg } from './cards/faction_5/egg';
import { f5Elucidator } from './cards/faction_5/elucidator';
import { f5Earthwalker } from './cards/faction_5/earthwalker';
import { f5Grimrock } from './cards/faction_5/grimrock';
import { f5Phalanxar } from './cards/faction_5/phalanxar';
import { f5SpiritHarvester } from './cards/faction_5/spirit-harvester';
import { f5Kolossus } from './cards/faction_5/kolossus';
import { f5Vindicator } from './cards/faction_5/vindicator';
import { f5YoungSilithar } from './cards/faction_5/young-silithar';
import { f5VeteranSilithar } from './cards/faction_5/veteran-silithar';
import { f5SilitharElder } from './cards/faction_5/silithar-elder';
import { f5UnstableLeviathan } from './cards/faction_5/unstable-leviathan';
import { f5FlashReincranation } from './cards/faction_5/flash-reincarnation';
import { f5Overload } from './cards/faction_5/overload';
import { f5NaturalSelection } from './cards/faction_5/natural-selection';
import { f5GreaterFortitude } from './cards/faction_5/greater-fortitude';
import { f5EarthSphere } from './cards/faction_5/earth-sphere';
import { f5PlasmaStorm } from './cards/faction_5/plasma-storm';
import { f5DiretideFrenzy } from './cards/faction_5/diretide-frenzy';
import { neutralAstralCrusader } from './cards/neutral/astral-crusader';
import { f5PrimordialGazer } from './cards/faction_5/primordial-gazer';
import { f5AdamantiteClaws } from './cards/faction_5/adamantite-claws';
import { f5KineticEquilibrium } from './cards/faction_5/kinetic-equilibrium';
import { f5TwinFangs } from './cards/faction_5/twin-fangs';
import { f5BoundedLifeforce } from './cards/faction_5/bounded-lifeforce';
import { f5Magma } from './cards/faction_5/magma';
import { f5Metamorphosis } from './cards/faction_5/metamorphosis';
import { f5Tremors } from './cards/faction_5/tremors';
import { f5DampeningWave } from './cards/faction_5/dampening-wave';
import { f5IridiumScale } from './cards/faction_5/iridium-scale';
import { f6Razorback } from './cards/faction_6/razoback';
import { f6FlashFreeze } from './cards/faction_6/flash-freeze';
import { f6FoxRavager } from './cards/faction_6/fox-ravager';
import { f6AspectOfTheFox } from './cards/faction_6/aspect-of-the-fox';
import { f6GhostWolf } from './cards/faction_6/ghost-wolf';
import { f6FenrirWarmaster } from './cards/faction_6/fenrir-warmaster';
import { neutralBladeshaker } from './cards/neutral/bladeshaker';
import { f6FrigidSpines } from './cards/faction_6/frigid-spines';
import { f6IceBarrier } from './cards/faction_6/ice-barrier';
import { f6BonechillBarrier } from './cards/faction_6/bonechill-barrier';
import { f6FrostWell } from './cards/faction_6/frost-well';
import { f6GravityWell } from './cards/faction_6/gravity-well';
import { f6ArcticDisplacer } from './cards/faction_6/arctic-displacer';
import { f6ChromaticCold } from './cards/faction_6/chromatic-cold';
import { f6BlazingSpines } from './cards/faction_6/blazing-spines';
import { f6Mesmerize } from './cards/faction_6/mesmerize';
import { f6Snowpiercer } from './cards/faction_6/snowpiercer';
import { f6GlacialElemental } from './cards/faction_6/glacial-elemental';
import { f6Avalanche } from './cards/faction_6/avalanche';
import { f6CrystalCloaker } from './cards/faction_6/crystal-cloaker';
import { f6Snowchaser } from './cards/faction_6/snowchaser';
import { f6FrosthornRhyno } from './cards/faction_6/frosthorn-rhyno';
import { f2BattlePanddo } from './cards/faction_2/battle_panddo';
import { f6HailstonePrison } from './cards/faction_6/hailstone_prison';
import { f6WhiteWyrm } from './cards/faction_6/white_wyrm';
import { f6AspectOfTheWyrm } from './cards/faction_6/aspect_of_the_wyrm';
import { f6SeismicElemental } from './cards/faction_6/seismic_elemental';
import { f6AspectOfTheMountain } from './cards/faction_6/aspect_of_the_mountain';
import { f6SpiritOfTheWild } from './cards/faction_6/spirit_of_the_wild';
import { f6Hearthsister } from './cards/faction_6/hearthsister';
import { f6Coldbiter } from './cards/faction_6/coldbiter';
import { f6BoreanBear } from './cards/faction_6/borean_bear';
import { f6Frostfire } from './cards/faction_6/frostfire';
import { f6Cryogenesis } from './cards/faction_6/cryogenesis';
import { neutralSkyrockGolem } from './cards/neutral/skyrock-golem';
import { neutralBloodshardGolem } from './cards/neutral/bloodshard-golem';
import { neutralHailstoneGolem } from './cards/neutral/heilstone-golem';
import { neutralBrightmossGolem } from './cards/neutral/brightmoss-golem';
import { neutralStormMetalGolem } from './cards/neutral/storm-metal-golem';
import { neutralDragonboneGolem } from './cards/neutral/dragonbone-golem';
import { neutralGolemVanguard } from './cards/neutral/golem-vanguard';
import { neutralGolemMetallurgist } from './cards/neutral/golem-metallurgist';
import { neutralNebula } from './cards/neutral/nebula';
import { neutralWorldcoreGolem } from './cards/neutral/worldcore-golem';
import { f2Vigiluchi } from './cards/faction_2/vigiluchi';
import { f3AncestralVessel } from './cards/faction_3/ancestral-vessel';
import { f3Anubis } from './cards/faction_3/anubis';
import { f1ArclyteProtector } from './cards/faction_1/arclyte-protector';
import { neutralWhistlingBlade } from './cards/neutral/whistling-blade';
import { f6Bubblesmith } from './cards/faction_6/bubblesmith';
import { f6WinterMaerid } from './cards/faction_6/winter-maerid';
import { f6VoiceOfTheWind } from './cards/faction_6/voice-of-thz-wind';
import { f6Treant } from './cards/faction_6/treant';
import { f6AncientGrove } from './cards/faction_6/anient-grove';
import { f2Whiplash } from './cards/faction_2/whiplash';
import { f5ScaleShaper } from './cards/faction_5/scaleshaper';
import { f3ScionsReliquary } from './cards/faction_3/scions-reliquary';
import { f2AncestralDivination } from './cards/faction_2/ancestral-divination';
import { neutralNightWatcher } from './cards/neutral/night-watcher';

const allCards: SerializedBlueprint<any>[] = [
  f1General,
  f1General2,
  f1General3,
  f1IroncliffeGuardian,
  f1TrueStrike,
  f1LionheartBlessing,
  f1Martyrdom,
  f1SunstoneBracers,
  f1SilverguardKnight,
  f1WindbladeAdept,
  f1AzuriteLion,
  f1SilverguardSquire,
  f1ArclyteSentinel,
  f1Lightchaser,
  f1Sunriser,
  f1LysianBrawler,
  f1SecondSun,
  f1Tempest,
  f1HolyImmolation,
  f1DivineBond,
  f1SundropElixir,
  f1SuntideMaiden,
  f1LastingJudgement,
  f1ArclyteRegalia,
  f1CircleOfLife,
  f1WarSurge,
  f1SunBloom,
  f1ElyxStormblade,
  f1Magnetize,
  f1SunstoneTemplar,
  f1Decimate,
  f1AegisBarrier,
  f1SkywindGlaives,
  f1ArclyteProtector,

  f2General,
  f2General2,
  f2General3,
  f2InnerFocus,
  f2KaidoAssassin,
  f2TuskBoar,
  f2ManaVortex,
  f2ChakriAvatar,
  f2CelestialPhantom,
  f2Rythmweaver,
  f2KeshraiFanblade,
  f2HammonBladeseeker,
  f2Gorehorn,
  f2Heartseeker,
  f2FourWindsMagus,
  f2PhoenixFire,
  f2SpiralTechnique,
  f2LanternFox,
  f2GhostLightning,
  f2Gotatsu,
  f2HeavensEclipse,
  f2KillingEdge,
  f2SaberspineSeal,
  f2MistDragonSeal,
  f2Juxtaposition,
  f2KageLightning,
  f2StormKage,
  f2Widowmaker,
  f2JadeMonk,
  f2ScarletViper,
  f2MaskOfShadows,
  f2Panddo,
  f2OnyxBearSeal,
  f2CycloneMask,
  f2MistWalking,
  f2BattlePanddo,
  f2Vigiluchi,
  f2Whiplash,
  f2AncestralDivination,

  f3General,
  f3General2,
  f3General3,
  f3WindDervish,
  f3EtherealObelysk,
  f3PortalGuardian,
  f3AymaraHealer,
  f3Chronomancer,
  f3Dunecaster,
  f3SandHowler,
  f3StaffOfYkir,
  f3WindShrike,
  f3Blindscorch,
  f3StarsFury,
  f3ZenuiTheBlghtspawned,
  f3ScionsFirstWish,
  f3ScionssSecondWish,
  f3ScionsThirdWish,
  f3BoneSwarm,
  f3OrbWeaver,
  f3Pyromancer,
  f3FusionBanshee,
  f3StarfireScarab,
  f3FireblazeObelisk,
  f3SiphonEnergy,
  f3InnerOasis,
  f3CosmicFlesh,
  f3DominateWill,
  f3EntropicDecay,
  f3RashasCurse,
  f3FountainOfYouth,
  f3Hexblade,
  f3TimeMaelstrom,
  f3AurorasTears,
  f3AncestralVessel,
  f3Anubis,
  f3ScionsReliquary,

  f4General,
  f4General2,
  f4General3,
  f4Wraithling,
  f4ShadowDancer,
  f4BloodmoonPriestess,
  f4BloodSiren,
  f4NightsorrowAssassin,
  f4ShadowWatcher,
  f4VorpalReaver,
  f4AbyssalCrawler,
  f4ReaperOfTheNineMoons,
  f4SoulScythe,
  f4Gloomchaser,
  f4BlackSolus,
  f4SpectralRevenant,
  f4GraspOfAgony,
  f4WraithlingSwarm,
  f4SphereOfDarkness,
  f4DaemonicLure,
  f4DarkSeed,
  f4VoidPulse,
  f4ShadowNova,
  f4BreathOfTheUnborn,
  f4DarkReflection,
  f4DarkTransormation,
  f4DarkfireSacrifice,
  f4DarkfireCrescendo,
  f4RitualBanishing,
  f4SoulshatterPact,
  f4RiteOfTheUndervault,
  f4SpectralBlade,
  f4SoulGrimoire,
  f4HornOfTheForsaken,

  f5General,
  f5General2,
  f5General3,
  f5MakantorWarbeast,
  f5Kujata,
  f5Egg,
  f5Elucidator,
  f5Earthwalker,
  f5Grimrock,
  f5Phalanxar,
  f5SpiritHarvester,
  f5Kolossus,
  f5Vindicator,
  f5YoungSilithar,
  f5VeteranSilithar,
  f5SilitharElder,
  f5UnstableLeviathan,
  f5FlashReincranation,
  f5Overload,
  f5NaturalSelection,
  f5GreaterFortitude,
  f5EarthSphere,
  f5PlasmaStorm,
  f5DiretideFrenzy,
  f5PrimordialGazer,
  f5AdamantiteClaws,
  f5KineticEquilibrium,
  f5TwinFangs,
  f5BoundedLifeforce,
  f5Magma,
  f5Metamorphosis,
  f5Tremors,
  f5DampeningWave,
  f5IridiumScale,
  f5ScaleShaper,

  f6General,
  f6General2,
  f6General3,
  f6Razorback,
  f6FlashFreeze,
  f6FoxRavager,
  f6AspectOfTheFox,
  f6GhostWolf,
  f6FenrirWarmaster,
  f6FrigidSpines,
  f6BlazingSpines,
  f6IceBarrier,
  f6BonechillBarrier,
  f6FrostWell,
  f6GravityWell,
  f6ArcticDisplacer,
  f6ChromaticCold,
  f6Mesmerize,
  f6Snowpiercer,
  f6GlacialElemental,
  f6Avalanche,
  f6CrystalCloaker,
  f6Snowchaser,
  f6FrosthornRhyno,
  f6HailstonePrison,
  f6WhiteWyrm,
  f6AspectOfTheWyrm,
  f6SeismicElemental,
  f6AspectOfTheMountain,
  f6SpiritOfTheWild,
  f6Hearthsister,
  f6Coldbiter,
  f6BoreanBear,
  f6Frostfire,
  f6Cryogenesis,
  f6Bubblesmith,
  f6WinterMaerid,
  f6VoiceOfTheWind,
  f6Treant,
  f6AncientGrove,

  neutralHealingMystic,
  neutralRiftWalker,
  neutralPrimusShieldMaster,
  neutralArakiHeadhunter,
  neutralAethermaster,
  neutralRepulsorBeast,
  neutralDreamgazer,
  neutralEphemeralShroud,
  neutralDancingBlades,
  neutralValeHunter,
  neutralPutridMindflayer,
  neutralSaberspineTiger,
  neutralProphetOfTheWhitePalm,
  neutralBloodtearAlchemist,
  neutralPrimusFist,
  neutralVenomToth,
  neutralBonereaper,
  neutralWingsOfParadise,
  neutralPiercingMantis,
  neutralArchonSpellbinder,
  neutralLightbender,
  neutralFlamebloodWarlock,
  neutralAzureHornShaman,
  neutralFrostboneNaga,
  neutralSyvrelTheExile,
  neutralMiniJax,
  neutralJaxTruesight,
  neutralTombstone,
  neutralDioltas,
  neutralRedSynja,
  neutralLuxIgnis,
  neutralEmeraldRejuvenator,
  neutralSwornAvenger,
  neutralVoidHunter,
  neutralSpellspark,
  neutralFlameAcolyte,
  neutralJaxi,
  neutralGhostLynx,
  neutralPandora,
  neutralPandoraBlue,
  neutralPandoraGreen,
  neutralPandoraPurple,
  neutralPandoraRed,
  neutralPandoraYellow,
  neutralPaddo,
  neutralAstralCrusader,
  neutralBladeshaker,
  neutralSkyrockGolem,
  neutralBloodshardGolem,
  neutralHailstoneGolem,
  neutralBrightmossGolem,
  neutralStormMetalGolem,
  neutralDragonboneGolem,
  neutralGolemVanguard,
  neutralGolemMetallurgist,
  neutralNebula,
  neutralWorldcoreGolem,
  neutralWhistlingBlade,
  neutralNightWatcher
];

export const CARDS = keyBy(allCards, 'id') as Record<
  CardBlueprintId,
  GenericSerializedBlueprint
>;
