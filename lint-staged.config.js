module.exports = {
  "**/*.{js,jsx}": ["eslint --fix"],
  "**/*.{ts,tsx}": [
    () => "tsc --project tsconfig.json --noEmit --skipLibCheck",
    "eslint --fix",
  ],
};
