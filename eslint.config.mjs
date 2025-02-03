{
  "env": {
    "node": true,
      "commonjs": false,
      "typescript": true,
    "browser": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "airbnb",
    "plugin:prettier/recommended" 
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-console": 0,
    "indent": 0,
    "linebreak-style": 0,
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 100,
        "tabWidth": 4,
        "semi": true
      }
    ]
  },
  "plugins": ["react", "prettier"],
  "rules": {
    "prettier/prettier": "error" // Show Prettier errors as ESLint errors
  }
}