import { Theme } from '@radix-ui/themes';
import type { FC, PropsWithChildren } from 'react';

import '@radix-ui/themes/styles.css';
import './themeOverrides.css';

// export const ThemeWrapper: FC<PropsWithChildren> = ({ children }) => {
//   const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: prefersDarkMode ? 'dark' : 'light',
//         },
//         typography: {
//           h1: { fontSize: '2.5rem' },
//           h2: { fontSize: '2.25rem' },
//           h3: { fontSize: '2rem' },
//           h4: { fontSize: '1.75rem' },
//           h5: { fontSize: '1.5rem' },
//           h6: { fontSize: '1.25rem' },
//         },
//       }),
//     [prefersDarkMode],
//   );

//   return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
// };

export const ThemeWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <Theme appearance="dark">{children}</Theme>;
};
