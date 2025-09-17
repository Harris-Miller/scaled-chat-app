/* eslint-disable no-console */
import { reset, seed } from 'drizzle-seed';
import { nanoid } from 'nanoid';

import { db } from './db';
import * as schema from './schema';
import { randomChatGptGeneratedPhrases } from './seedData';

const harrisId = 'X2jsoEJMJt65CV6I472gZ';

const userIdSeeds = [
  'jMjDsHBbPQO4UaXFzQPNS',
  'oCPdPutVGH5fAJ32qXHRt',
  '-X7-iPJAmIJl8EqfLSu9b',
  'QwmIWWuCkG9cOt5dWzHFD',
  '_JINfnVl8ZunaJhRWxsfP',
  '2zBLvv7Qw92V3CjuI6WPY',
  'BXudqRkt2w1T5e059eY2P',
  'RrPzQoTFIYq6DIgjAo3O_',
  'qqrU9xChx0K7_Sm-oLeb2',
  '-SHg32kTLRPT0DHGUC_xj',
  'iXEdk3mLNs6PfG8d9is1-',
  'CbxQFZ5BgdUwfaO09Yszo',
  '8EznFcmOBQ3MzxI4vXMAh',
  'esz-Q6fRHYVWpkrDwSoIP',
  'T5VYHRP3gfvR7hWA-YZQz',
  'nVx8QbYIOPMcwHdAVRTfb',
  'zlnXky5GIyI_RNKSGy3MN',
  '0n9go6Dvn8q_bf66A5E15',
  'D9O_HT6XrxViDUjlTZcoA',
  '-MY4DGyiKOWeromZOBPG3',
  '9PjPBhg_pNThAPHmFFRVI',
  'ez4ek554X4uSEcXJGNeMm',
  'J5z5HyPz6zd4TkJR74ftR',
  'XnuiWuSWyajAd-fHDAnFw',
  'A0R-haHLsxFeKCT_mx_-S',
  'QFVFFb2ZaNQErzzeRM0Yx',
  '-Fpoli3OCQkLIPh5TrlVJ',
  '0SaxuJSXWw8x7A-0aaSzt',
  'eqPzojhf2G2jUSR2PkWcn',
  'hyKfOT4ELqSpmzDtfu4CF',
  'R8lkvvO4r7YZiw57ie6vL',
  'g6eEU5yfVBJVwnf3iijkT',
  '2ZKjE8zqJ-M8vJV4Tzxli',
  'GnzU-eKi7pVJad-4ATaV8',
  'b4EwzzxZljaM7PPcIU3im',
  'bL6yZRzwy6kLY7xUu-hJG',
  '3ilONheC35ehTsc_zxIeU',
  'gYYJDzgqwYy48ULMNiceJ',
  'poJhvmAtNS3yU5o0kajjE',
  '8-FUl2IQTwqsIhpICWzjL',
  'w1V0x6pKJzoUbJHt-TIeH',
  'eV445ptvnO8eChIy3Y7ix',
  'cNeFMRN_Sfo1ICVfoAiu6',
  'EBzPSqUWpWv8d5ueLCsdy',
  'NIdpWmQeHD6U06ER0zATJ',
  'CLZD1AF2AA0MXxTBLqlYh',
  'tKs-hkbZhkCRfMI6_9_FI',
  'YnOePQvMQKlG3Xyz2A1FH',
  '21VqHyow936qPJzTY1W3U',
  'SlH_NHQRd4OExmEsSzL2O',
  'mKKTHZg_QCwHYa2oN_ymG',
  'E3g1zzuiRPsxNWfIv0sXY',
  '11z_R6gyIFAmuhPUk5nbR',
  'f-4lH9Yky7uYKMgNKfeRw',
  'A_Pbz63QzB-GOeI-hdw5Y',
  '1CQpcWJZo2GFxa19fnkDc',
  'nkXRvkf76vXy-2Q0st-IM',
  'PGuDaQKPPMGBExAvMbrEk',
  'iDwgCyRRotimqHtVPofMS',
  'vDu7jXN0DgeO8D--e5wt7',
  'j0sx7Hy718pbA-tTv2Dx8',
  '03vmvUwQaFMd6j7ya2gSO',
  'PTz1XmfPmFt6su-I7mf_m',
  'SCulRoflD_0oz3Nak3QVK',
  'llp0rpyFYBJ6WxHweIAVZ',
  '3HOeRVV6DuqUkj8WWl_qT',
  'jMupEvC0DnTic6uaerJ3G',
  'rxQ730imFYHmqNpy4HDpD',
  'nNxevqtzkIfI3yjkgFhGE',
  'hi1PpFEpTwA3hMOewTsqy',
  'UkHcEWR4h4ELZGaGlkjOE',
  'fqXquByUaQsK_2_CnBAYw',
  '84tVe8uRMHSCjz6d70v7o',
  'oK-KFP60u5qivO37gt2U0',
  'i3i9-LsSNcjo4YIddVxx8',
  'MANkswvP4V8vIc8wrAEJG',
  'OIh05r574u2ZOiAohl_Nf',
  '2m6MiKXhqsQJvqd6hz2V6',
  'D2FAYqZvpGEQxUaLKJr3T',
  '1L8tnATlGVWjAi54QL7Qi',
  'HLtEsty96ydQZxXZhP5k7',
  'cYk40Duu2Cq4L3jxN4egE',
  '12fy55SDdjV0W0L8wnIte',
  'vPxrEDJH6auGcmzUtoQXH',
  'CbE9EYFcyzhnsvFMFvyqm',
  'azJp_wQ-G0rKqvPSvrhsu',
  'mJWvaNXh070Cocj8JzPLm',
  'wmnMuIp6o3GiwdShn0yXu',
  'VH88gL3t1GCs2AkpmNtVp',
  'vjzvvXMRQdmfMf1gVf_B0',
  'bhH4WuRpNO-AO6KELaXJ5',
  'omD9griyoYAKsv1STwWkR',
  'iV2_u155XLuaztABOLhDE',
  'r-AV96JuRv3BvQYwR5mlC',
  'isMfndixCy3HuQmq2RT5t',
  'OBjBF2_E12gxEuKfXT6oW',
  'jR-lqnON8PWiJ4laVhJ1N',
  'MFkoaLnv8S7ro0aCPzWnw',
  'ee69e9R2y0-VsEFRIBhN6',
  'kCfHGGgPailGQPXSDMYj9',
];

const roomIdSeeds = [
  'OvLK_rsZn1eAaiPQa3w8z',
  '4eOX0TLEHfixOGorVBRoF',
  'kcc4nBtLBXt82hODu9YqF',
  'XwnPegbDTNwBSolJB0d-W',
  'w8amkZr_25BXIIuBwI-_L',
  '9bCy8qluSyRAJA2pqX373',
  'PVQlCqrMPAM60Hd7YucJF',
  'Y0mdHs5rIxEnsqOTVhkZ1',
];

const roomNames = ['Mercery', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

const rightNow = new Date();

export const seedDb = async () => {
  // seed
  reset(db, schema);
  console.log('db reset');

  const passwordHash = await Bun.password.hash('password123');

  await db.insert(schema.users).values({
    createdAt: rightNow,
    displayName: 'Harris',
    email: 'harris@email.com',
    id: harrisId,
    passwordHash,
    updatedAt: rightNow,
  });

  await seed(db, schema).refine(funcs => {
    return {
      chats: {
        columns: {
          // @ts-expect-error - false positive
          createdAt: funcs.valuesFromArray({ values: [rightNow] }),
          id: funcs.valuesFromArray({
            isUnique: true,
            values: Array(1200)
              .fill(undefined)
              .map(() => nanoid()),
          }),
          text: funcs.valuesFromArray({ values: randomChatGptGeneratedPhrases }),
          // @ts-expect-error - false positive
          updatedAt: funcs.valuesFromArray({ values: [rightNow] }),
        },
        count: 1250,
      },
      directMessages: {
        count: 0,
      },
      profilePics: {
        count: 0,
      },
      rooms: {
        columns: {
          // @ts-expect-error - false positive
          createdAt: funcs.valuesFromArray({ values: [rightNow] }),
          // adminId: funcs.valuesFromArray({ values: [harrisId] }),
          id: funcs.valuesFromArray({ isUnique: true, values: roomIdSeeds }),
          name: funcs.valuesFromArray({ isUnique: true, values: roomNames }),
          // @ts-expect-error - false positive
          updatedAt: funcs.valuesFromArray({ values: [rightNow] }),
        },
        count: 8,
        with: {
          chats: 150,
        },
      },
      users: {
        columns: {
          // @ts-expect-error - false positive
          createdAt: funcs.valuesFromArray({ values: [rightNow] }),
          displayName: funcs.firstName({ isUnique: true }),
          email: funcs.email(),
          id: funcs.valuesFromArray({ isUnique: true, values: userIdSeeds }),
          passwordHash: funcs.default({ defaultValue: passwordHash }),
          // @ts-expect-error - false positive
          updatedAt: funcs.valuesFromArray({ values: [rightNow] }),
        },
        count: 50,
        with: {
          chats: 24,
        },
      },
    };
  });

  console.log('db seeded!');
};

await seedDb();
