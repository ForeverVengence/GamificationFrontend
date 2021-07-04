import { extendTheme, theme } from '@chakra-ui/react';

const myTheme = extendTheme({
  styles: {
    global: {
      'html, body, #root': {
        height: '100%',
      },
    },
  },
  fonts: {
    heading: `'Poppins', ${theme.fonts.heading}`,
    body: `${theme.fonts.body}`,
  },
  sizes: {
    container: {
      xs: '320px',
      sm: '572px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
    },
  },
});

export default myTheme;
