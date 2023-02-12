const path = require('path');
const fs = require('fs');
const solc = require('solc');

const purchasePath = path.resolve(__dirname, 'contracts', 'Purchase.sol');
const source = fs.readFileSync(purchasePath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Purchase.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Purchase.sol'
].Purchase;
