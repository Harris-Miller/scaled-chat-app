import { indexBy } from 'ramda';

import type { APIReference, Choice } from './common.types';
import backgroundsRaw from './json/5e-SRD-Backgrounds.json';

// TODO: look into this
type Equipment = {
  equipment: APIReference;
  quantity: number;
};

type Feature = {
  desc: string[];
  name: string;
};

export type Background = {
  bonds: Choice;
  feature: Feature;
  flaws: Choice;
  ideals: Choice;
  index: string;
  language_options?: Choice;
  name: string;
  personality_traits: Choice;
  starting_equipment: Equipment[];
  starting_equipment_options: Choice[];
  starting_proficiencies: APIReference[];
  url?: string;
};

const charlatan: Background = {
  bonds: {
    choose: 1,
    from: {
      option_set_type: 'options_array',
      options: [
        {
          option_type: 'string',
          string:
            'I fleeced the wrong person and must work to ensure that this individual never crosses paths with me or those I care about.',
        },
        {
          option_type: 'string',
          string: 'I owe everything to my mentor — a horrible person who’s probably rotting in jail somewhere.',
        },
        {
          option_type: 'string',
          string:
            'Somewhere out there, I have a child who doesn’t know me. I’m making the world better for him or her.',
        },
        {
          option_type: 'string',
          string:
            'I come from a noble family, and one day I’ll reclaim my lands and title from those who stole them from me.',
        },
        {
          option_type: 'string',
          string: '	A powerful person killed someone I love. Some day soon, I’ll have my revenge.',
        },
        {
          option_type: 'string',
          string:
            'I swindled and ruined a person who didn’t deserve it. I seek to atone for my misdeeds but might never be able to forgive myself.',
        },
      ],
    },
    type: 'bonds',
  },
  feature: {
    desc: [
      'You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.',
    ],
    name: 'False Identity',
  },
  flaws: {
    choose: 1,
    from: {
      option_set_type: 'options_array',
      options: [
        {
          option_type: 'string',
          string: 'I can’t resist a pretty face.',
        },
        {
          option_type: 'string',
          string: 'I’m always in debt. I spend my ill-gotten gains on decadent luxuries faster than I bring them in..',
        },
        {
          option_type: 'string',
          string: 'I’m convinced that no one could ever fool me the way I fool others.',
        },
        {
          option_type: 'string',
          string: 'I’m too greedy for my own good. I can’t resist taking a risk if there’s money involved.',
        },
        {
          option_type: 'string',
          string: 'I can’t resist swindling people who are more powerful than me.',
        },
        {
          option_type: 'string',
          string:
            'I hate to admit it and will hate myself for it, but I’ll run and preserve my own hide if the going gets tough.',
        },
      ],
    },
    type: 'flaws',
  },
  ideals: {
    choose: 1,
    from: {
      option_set_type: 'options_array',
      options: [
        {
          alignments: [
            {
              index: 'chaotic-good',
              name: 'Chaotic Good',
              url: '/api/alignments/chaotic-good',
            },
            {
              index: 'chaotic-neutral',
              name: 'Chaotic Neutral',
              url: '/api/alignments/chaotic-neutral',
            },
            {
              index: 'chaotic-evil',
              name: 'Chaotic Evil',
              url: '/api/alignments/chaotic-evil',
            },
          ],
          desc: 'Independence. I am a free spirit — no one tells me what to do.',
          option_type: 'ideal',
        },
        {
          alignments: [
            {
              index: 'lawful-good',
              name: 'Lawful Good',
              url: '/api/alignments/lawful-good',
            },
            {
              index: 'lawful-neutral',
              name: 'Lawful Neutral',
              url: '/api/alignments/lawful-neutral',
            },
            {
              index: 'lawful-evil',
              name: 'Lawful Evil',
              url: '/api/alignments/lawful-evil',
            },
          ],
          desc: 'Fairness. I never target people who can’t afford to lose a few coins.',
          option_type: 'ideal',
        },
        {
          alignments: [
            {
              index: 'lawful-good',
              name: 'Lawful Good',
              url: '/api/alignments/lawful-good',
            },
            {
              index: 'neutral-good',
              name: 'Neutral Good',
              url: '/api/alignments/neutral-good',
            },
            {
              index: 'chaotic-good',
              name: 'Chaotic Good',
              url: '/api/alignments/chaotic-good',
            },
          ],
          desc: 'Charity. I distribute the money I acquire to the people who really need it.',
          option_type: 'ideal',
        },
        {
          alignments: [
            {
              index: 'chaotic-good',
              name: 'Chaotic Good',
              url: '/api/alignments/chaotic-good',
            },
            {
              index: 'chaotic-neutral',
              name: 'Chaotic Neutral',
              url: '/api/alignments/chaotic-neutral',
            },
            {
              index: 'chaotic-evil',
              name: 'Chaotic Evil',
              url: '/api/alignments/chaotic-evil',
            },
          ],
          desc: 'Creativity. I never run the same con twice.',
          option_type: 'ideal',
        },
        {
          alignments: [
            {
              index: 'lawful-good',
              name: 'Lawful Good',
              url: '/api/alignments/lawful-good',
            },
            {
              index: 'neutral-good',
              name: 'Neutral Good',
              url: '/api/alignments/neutral-good',
            },
            {
              index: 'chaotic-good',
              name: 'Chaotic Good',
              url: '/api/alignments/chaotic-good',
            },
          ],
          desc: 'Friendship. Material goods come and go. Bonds of friendship last forever.',
          option_type: 'ideal',
        },
        {
          alignments: [
            {
              index: 'lawful-good',
              name: 'Lawful Good',
              url: '/api/alignments/lawful-good',
            },
            {
              index: 'neutral-good',
              name: 'Neutral Good',
              url: '/api/alignments/neutral-good',
            },
            {
              index: 'chaotic-good',
              name: 'Chaotic Good',
              url: '/api/alignments/chaotic-good',
            },
            {
              index: 'lawful-neutral',
              name: 'Lawful Neutral',
              url: '/api/alignments/lawful-neutral',
            },
            {
              index: 'neutral',
              name: 'Neutral',
              url: '/api/alignments/neutral',
            },
            {
              index: 'chaotic-neutral',
              name: 'Chaotic Neutral',
              url: '/api/alignments/chaotic-neutral',
            },
            {
              index: 'lawful-evil',
              name: 'Lawful Evil',
              url: '/api/alignments/lawful-evil',
            },
            {
              index: 'neutral-evil',
              name: 'Neutral Evil',
              url: '/api/alignments/neutral-evil',
            },
            {
              index: 'chaotic-evil',
              name: 'Chaotic Evil',
              url: '/api/alignments/chaotic-evil',
            },
          ],
          desc: 'Aspiration. I’m determined to make something of myself.',
          option_type: 'ideal',
        },
      ],
    },
    type: '',
  },
  index: 'charlatan',
  name: 'Charlatan',
  personality_traits: {
    choose: 2,
    from: {
      option_set_type: 'options_array',
      options: [
        {
          option_type: 'string',
          string: 'I fall in and out of love easily, and am always pursuing someone.',
        },
        {
          option_type: 'string',
          string: 'I have a joke for every occasion, especially occasions where humor is inappropriate.',
        },
        {
          option_type: 'string',
          string: 'Flattery is my preferred trick for getting what I want.',
        },
        {
          option_type: 'string',
          string: 'I’m a born gambler who can’t resist taking a risk for a potential payoff.',
        },
        {
          option_type: 'string',
          string: 'I lie about almost everything, even when there’s no good reason to.',
        },
        {
          option_type: 'string',
          string: 'Sarcasm and insults are my weapons of choice.',
        },
        {
          option_type: 'string',
          string:
            'I keep multiple holy symbols on me and invoke whatever deity might come in useful at any given moment.',
        },
        {
          option_type: 'string',
          string: 'I pocket anything I see that might have some value.',
        },
      ],
    },
    type: 'personality_traits',
  },
  starting_equipment: [
    {
      equipment: {
        index: 'clothes-fine',
        name: 'Clothes, fine',
      },
      quantity: 1,
    },
    {
      equipment: {
        index: 'disguise-kit',
        name: 'Disguise Kit',
      },
      quantity: 1,
    },
    {
      equipment: {
        index: 'pouch',
        name: 'Pouch',
        url: '/api/equipment/pouch',
      },
      quantity: 1,
    },
  ],
  starting_equipment_options: [
    {
      choose: 1,
      from: {
        equipment_category: {
          index: 'gaming-sets',
          name: 'Gaming Sets',
        },
        option_set_type: 'equipment_category',
      },
      type: 'equipment',
    },
  ],
  starting_proficiencies: [
    {
      index: 'skill-deception',
      name: 'Deception',
    },
    {
      index: 'skill-sleight-of-hand',
      name: 'Sleight of Hand',
    },
  ],
};

export const backgrounds = [...(backgroundsRaw as unknown as Background[]), charlatan];
export const backgroundsByIndex = indexBy(m => m.index, backgrounds);
