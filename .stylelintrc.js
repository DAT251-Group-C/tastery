const ignoreAtRules = ['tailwind', 'apply', 'variants', 'responsive', 'screen'];
const atRuleNoUknown = [true, { ignoreAtRules }];

module.exports = {
  root: true,
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
  rules: {
    'scss/at-rule-no-unknown': null,
    'at-rule-no-unknown': atRuleNoUknown,
  },
};
