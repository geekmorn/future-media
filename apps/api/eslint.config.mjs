// @ts-check
import nestConfig from '@repo/eslint-config/nest';

export default [
  ...nestConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
