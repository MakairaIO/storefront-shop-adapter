module.exports = {
  '*': 'prettier --write',
  '**/*.{js,jsx,ts,tsx}': () => 'npm run lint:eslint',
  '**/*.{ts,tsx}': () => 'npm run lint:tsc',
}
