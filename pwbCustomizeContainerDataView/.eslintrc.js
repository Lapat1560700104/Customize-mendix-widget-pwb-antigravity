const base = require("@mendix/pluggable-widgets-tools/configs/eslint.ts.base.json");

module.exports = {
    ...base,
    overrides: [
        ...(base.overrides || []),
        {
            // JS config files (e.g. .eslintrc.js, prettier.config.js) should NOT
            // be type-checked via tsconfig.json — they are not included in it.
            files: ["*.js"],
            parserOptions: {
                project: null
            }
        },
        {
            // Relax rules for the playground demo file
            files: ["playground/**/*.tsx", "playground/**/*.ts"],
            rules: {
                curly: "off",
                "object-shorthand": "off",
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "no-undef": "off"
            }
        }
    ]
};
