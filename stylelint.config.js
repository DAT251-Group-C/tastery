module.exports = {
  root: true,
  extends: 'stylelint-config-standard-scss',
  rules: {
    'at-rule-empty-line-before': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function',
          'if',
          'else',
          'return',
          'each',
          'include',
          'mixin',
          'define-mixin',
          'tailwind',
          'apply',
          'responsive',
          'variants',
          'at-root',
          'use',
          'screen',
        ],
      },
    ],
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'selector-list-comma-newline-after': null,
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
  },
};
