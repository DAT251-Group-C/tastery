module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['*.ts', '*.html', '*.vue', '*.js'],
      plugins: ['import'],
      extends: ['plugin:vue/vue3-recommended', '@vue/typescript/recommended', 'eslint:recommended', 'prettier'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 2022,
      },
      rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'space-before-function-paren': [
          'error',
          {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always',
          },
        ],
        'padded-blocks': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
          },
        ],
        'no-multiple-empty-lines': [
          'error',
          {
            max: 1,
          },
        ],
        'keyword-spacing': [
          'error',
          {
            after: true,
          },
        ],
        'max-len': [
          'error',
          {
            code: 200,
            ignorePattern: '^\\s*<path',
          },
        ],
        'no-param-reassign': [
          2,
          {
            props: false,
          },
        ],
        'object-curly-newline': [
          'error',
          {
            consistent: true,
            multiline: true,
          },
        ],
        'no-extra-boolean-cast': 'error',
        'import/extensions': [
          'error',
          {
            ts: 'never',
            js: 'never',
            vue: 'always',
            json: 'always',
            png: 'always',
            jpg: 'always',
            mp3: 'always',
            mp4: 'always',
          },
        ],
        indent: [
          'error',
          2,
          {
            SwitchCase: 0,
          },
        ],
        'vue/comment-directive': 0,
        'vue/multi-word-component-names': 'off',
        'vue/attribute-hyphenation': ['error', 'never'],
        'vue/require-default-prop': 'off',
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts', '.vue', '.json'],
          },
        },
      },
    },
  ],
};
