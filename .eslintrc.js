const INDENTATION = 4;

module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    env: {
        'browser': true
    },
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        'no-unused-vars': 'off',
        'comma-dangle': ['error', 'never'],
        'func-names': ['error', 'never'],
        'no-console': [
            'error',
            {
                allow: [
                    'info',
                    'warn',
                    'error'
                ]
            }
        ],
        eqeqeq: 'warn',
        'no-var': 'off',
        'object-shorthand': 'off',
        'prefer-rest-params': 'off',
        'prefer-arrow-callback': 'off',
        'prefer-template': 'off',
        'one-var': 'off',
        'prefer-destructuring': 'off',
        'space-before-function-paren': 'off',
        'quote-props': 'error',
        indent: ['error', INDENTATION],
        '@typescript-eslint/indent': ['error', INDENTATION],
        'max-len': 'off',
        'prefer-spread': 'off',
        'no-underscore-dangle': 'off',
        'no-use-before-define': [
            'error',
            {
                functions: false,
                classes: false
            }
        ],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^(event|e|props)$'
            }
        ],
        'no-plusplus': [
            'error',
            {
                allowForLoopAfterthoughts: true
            }
        ],
        'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': [
            'error',
            'never',
            {
                scss: 'always'
            }
        ],
        'import/no-cycle': 'off',
        'react/jsx-indent': ['error', INDENTATION],
        'react/jsx-indent-props': ['error', INDENTATION],
        'react/sort-comp': 'off',
        'react/no-unused-prop-types': 'warn',
        'react/no-unused-state': 'warn',
        'react/prop-types': 'off',
        'react/destructuring-assignment': ['warn', 'always'],
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-fragments': ['error', 'element'],
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off'
    }
}
