// eslint-disable-next-line no-undef
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "svelte3"
  ],
  "overrides": [
    {
      "files": ["*.svelte"],
      "processor": "svelte3/svelte3"
    }
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double",
      { "avoidEscape": true }
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
