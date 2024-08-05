/** @type {import("prettier").Config} */

export default {
  plugins: ["prettier-plugin-astro"],

  printWidth: 80,
  proseWrap: "always",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,

  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
