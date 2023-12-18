module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  plugins: [
    'import'
  ],
  rules: {
    // 防止循环依赖
    'import/no-cycle': ['error', { maxDepth: Infinity }],
    // 确保导入语句中的路径正确
    'import/no-unresolved': 'error',
    'no-var': 'error',
    // allow paren-less arrow functions
    'arrow-parens': ['error', 'as-needed'],
    // set maximum line characters
    'max-len': ['error', {
      code: 140,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreTrailingComments: true,
    }],
    complexity: ['error', 32],
    'no-unused-vars': 'error',
    'object-curly-spacing': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'always',
        asyncArrow: 'always',
      },
    ],
  },
  overrides: [
    {
      files: '**/*.jsx',
      rules: {
        'jsx-quotes': 'error',
        'react/jsx-boolean-value': 'error',
        'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
        'react/jsx-curly-brace-presence': 'error',
        'react/jsx-wrap-multilines': ['error', {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
        }],
      }
    }
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src']
        ],
        extensions: ['.js', '.jsx', '.json', '.vue']
      }
    }
  }
}
