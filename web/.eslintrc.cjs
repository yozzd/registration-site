module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', '@nuxt/eslint-config'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'no-underscore-dangle': 0,
    'no-undef': 0,
    'vue/multi-word-component-names': 0,
  },
};
