const inquirer = require("inquirer");
const HDWallet = require('./hdwallet');

(async() => {
  let answers = await inquirer.prompt([{
      type: "input",
      name: "masterPubkey",
      message: "Master Public Key: "
    },
    {
      type: "input",
      message: "Chain code: ",
      name: "chainCode",
    },
    {
      type: 'input',
      name: 'index',
      message: 'Enter index:',
      default: function() {
        return '0';
      }
    },
    {
      type: 'list',
      name: 'platform',
      message: 'Which platform do you need?',
      choices: ['BTC', 'ETH', 'USDT'],
      filter: function(val) {
        return val.toUpperCase();
      }
    },
    {
      type: 'list',
      name: 'network',
      message: 'Which network do you need?',
      choices: ['MAINNET', 'TESTNET'],
      filter: function(val) {
        return val.toUpperCase();
      }
    },
  ]);

  let index = parseInt(answers.index);
  let account = await HDWallet.exportChildAddress(Buffer.from(answers.masterPubkey, "hex"), Buffer.from(answers.chainCode, "hex"), answers.platform, index, answers.network);
  if (!account)
    console.log(' - Can not create account');
  else {
    console.log(' - Public key: ', account.public);
    console.log(' - Address: ', account.address);
  }
})();