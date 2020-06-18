const { NativeEventEmitter } = require("react-native");

module.exports = {
  bracketSpacing: false,
  jsxBracketSameLine: true,
  singleQuote: true,
  "trailing-comma": [
    true,
    {
      "multiline": {
        "objects": "always",
        "arrays": "always",
        "functions": "never",
        "typeLiterals": "ignore"
      },
      "esSpecCompliant": true
    }
  ],
  "comma-dangle": "never",
};
