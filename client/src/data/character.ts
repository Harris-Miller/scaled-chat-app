/* eslint-disable typescript-sort-keys/interface */

//
// Using this file to type-out DB tables
//

export type PlayerCharacter = {
  // PK
  id: string;
  // FK
  playerId: string;
  createdAt: string;
  updatedAt: string;

  // Character name
  name: string;

  // Play style options - overridable if attached to campaign
  advancementType: 'milestone' | 'xp';
  hitPointType: 'fixed' | 'manual';
  allowFeats: boolean;
  multiClassRequirements: boolean;
  showLevelScaledSpells: boolean;
  encumbranceType: 'off' | 'use' | 'variant';
  ignoreCoinWeight: boolean;

  // personal choice
  abilityScoreDisplay: 'modifiers' | 'scores';
  // TODO
  privacy: string;

  // Race
  // union of possible choices from 5e-SDR racesIndexes
  race: string;
  // union of possible choices from 5e-SDR subracesIndexes, or null for race's that don't have subraces
  subrace: string | null;

  // class
  // Character hasMany Classes, see that table for details

  // Ability Scores
  // these hold the base only
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // background
  // TODO

  // description
  // character details
  // todo, union of options
  alignment: string;
  faith: string;
  // todo: union of options
  lifestyle: string;
  // physical characters
  hair: string;
  skin: string;
  eyes: string;
  height: string;
  weight: string;
  age: string;
  gender: string;
  // personal characteristics
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  // notes - will be markdown for frontend editing
  organizations: string;
  allies: string;
  enemies: string;
  backstory: string;
  other: string;

  // in game
  // hp and tempHp represent "out of total", when set to null, assume full health
  hp: number | null;
  tempHp: number | null;
  exhaustion: number;
  inspiration: boolean;
  // TODO:
  attunement: string[];

  // always prepared spells because of race, class, items, etc will be auto-determined, as well as cantrips
  // this list is for wizards, clerics, and druids
  preparedSpells: string[];
};

// players can choose N levels per class
export type PlayerClass = {
  // union of possible choices from 5e-SDR classIndexes
  class: string;
  levels: number;
  // entry per level, set automatically or manually
  hitPoints: number[];
  // class hasMany traits, but some of those traits require choices
  // these are unique per class and per level, so probably just go with jsonb to simplify
  classTraits: object;
};

// player hasMany equipment
export type PlayerEquipment = {
  // PK
  id: string;
  // FK
  playerId: string;
  createdAt: string;
  updatedAt: string;

  // will always be an equipmentIndex
  name: string;
  // this one is tricky, weapons and armour should be single entry per item,
  // but camp/backpack items should be many-per-entry (eg rations x 10)
  quantity: number | null;
  // TODO: figure this one
  // does this mean "you have it on you" versus its left at camp?
  // or does it mean what you currently have in your hand, and which hand
  equipped: boolean;
};

// player hasMany conditions
export type PlayerCondition = {
  // PK
  id: string;
  // FK
  playerId: string;
  createdAt: string;
  updatedAt: string;

  // some conditions get applied such that they last N rounds
  // 0 here means the condition will end after the player's turn
  roundsLeft: number | null;
};

// player hasMany spells
// items that give spells will be auto-applied
export type PlayerSpell = {
  // PK
  id: string;
  // FK
  playerId: string;
  createdAt: string;
  updatedAt: string;
};

// available spell slots are determined by classes
// this table is to keep track of "used" by level
export type PlayerSpellSlots = {
  // PK
  id: string;
  // FK
  playerId: string;
  createdAt: string;
  updatedAt: string;

  level: number;
  used: number;
};

// track usage of Actions with limited usage that are granted by
export type PlayerActionUsage = {
  // PK
  id: string;
  // FK
  playerId: string;
  createdAt: string;
  updatedAt: string;

  // TODO: figure out exactly what there need to be
  name: string;
  used: number;
  // id of race, class, equipment, etc, TBD
  source: string;
};

export type Campaign = {
  // PK
  id: string;
  // FK
  ownerId: string;

  name: string;

  // Play style option overrides
  advancementType: 'milestone' | 'xp';
  hitPointType: 'fixed' | 'manual';
  allowFeats: boolean;
  multiClassRequirements: boolean;
  showLevelScaledSpells: boolean;
  encumbranceType: 'off' | 'use' | 'variant';
  ignoreCoinWeight: boolean;
};
