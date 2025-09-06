export type APIReference = {
  index: string;
  name: string;
  url?: string;
};

export type Choice = {
  choose: number;
  desc?: string;
  from: OptionSet;
  type: string;
};

export interface AreaOfEffect {
  size: number;
  type: 'cone' | 'cube' | 'cylinder' | 'line' | 'sphere';
}

export type OptionSet = EquipmentCategoryOptionSet | OptionsArrayOptionSet | ResourceListOptionSet;

export type OptionsArrayOptionSet = {
  option_set_type: 'options_array';
  options: Option[];
};

export type EquipmentCategoryOptionSet = {
  equipment_category: APIReference;
  option_set_type: 'equipment_category';
};

export type ResourceListOptionSet = {
  option_set_type: 'resource_list';
  resource_list_url: string;
};

export type DifficultyClass = {
  dc_type: APIReference;
  dc_value?: number;
  success_type: 'half' | 'none' | 'other';
};

export type Damage = {
  damage_dice: string;
  damage_type: APIReference;
};

export type Option =
  | AbilityBonusOption
  | ActionOption
  | BreathOption
  | ChoiceOption
  | CountedReferenceOption
  | DamageOption
  | IdealOption
  | MultipleOption
  | ReferenceOption
  | ScorePrerequisiteOption
  | StringOption;

export type ReferenceOption = {
  item: APIReference;
  option_type: 'reference';
};

export type ActionOption = {
  action_name: string;
  count: number | string;
  notes: string;
  option_type: 'action';
  type: 'ability' | 'magic' | 'melee' | 'ranged';
};

export type MultipleOption = {
  items: Option[];
  option_type: 'multiple';
};

export type ChoiceOption = {
  choice: Choice;
  option_type: 'choice';
};

export type StringOption = {
  option_type: 'string';
  string: string;
};

export type IdealOption = {
  alignments: APIReference[];
  desc: string;
  option_type: 'ideal';
};

export type CountedReferenceOption = {
  count: number;
  of: APIReference;
  option_type: 'counted_reference';
  prerequisites?: {
    proficiency?: APIReference;
    type: 'proficiency';
  }[];
};

export type ScorePrerequisiteOption = {
  ability_score: APIReference;
  minimum_score: number;
  option_type: 'score_prerequisite';
};

export type AbilityBonusOption = {
  ability_score: APIReference;
  bonus: number;
  option_type: 'ability_bonus';
};

export type BreathOption = {
  damage?: Damage[];
  dc: DifficultyClass;
  name: string;
  option_type: 'breath';
};

export type DamageOption = {
  damage_dice: string;
  damage_type: APIReference;
  notes: string;
  option_type: 'damage';
};
