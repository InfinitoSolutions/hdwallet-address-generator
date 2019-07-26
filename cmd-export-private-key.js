const inquirer = require("inquirer");
const Bip39 = require('bip39');
const HDWallet = require('./hdwallet');

const passwordValidation = value => {
  if (value == '')
    return true;
  if (/[A-Za-z]/.test(value) && /\d/.test(value))
    return true;

  return 'Password need to have at least a letter and a number';
};

(async() => {
  let answers = await inquirer.prompt([{
      type: "input",
      name: "passphrase",
      message: "Enter 12 word passphrase: ",
      default: function() {
        return Bip39.generateMnemonic(128);
      },
      filter: function(val) {
        let words = [];
        let arr = val.split(' ');
        arr.forEach((item) => {
          if (item != null && item.length > 0) {
            words.push(item);
          }
        });
        return words.join(' ');
      }
    },
    {
      type: "password",
      message: "Enter password: ",
      name: "password",
      mask: "*",
      validate: passwordValidation
    },
    {
      type: "password",
      message: "Enter confirmed password: ",
      name: "confirm_password",
      mask: "*",
      validate: passwordValidation
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
      type: 'input',
      name: 'index',
      message: 'Enter index:',
      default: function() {
        return '0';
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

  if (answers.password !== answers.confirm_password) {
    console.log("Confirmed password is invalid");
    return;
  }

  let index = parseInt(answers.index);
  let account = await HDWallet.exportChildKey(answers.passphrase, answers.platform, index, answers.password, answers.network);
  if (!account) {
    console.log(' - Can not create account');
  } else {
    console.log('account :', account);
    let wifCompress = HDWallet.convertToWIF(account.private, answers.network, true)
    let wifUnCompress = HDWallet.convertToWIF(account.private, answers.network, false)
    console.log(' - Private key: ', account.private);
    console.log(' - Private wif key (Compressed): ', wifCompress);
    console.log(' - Private wif key (Uncompress): ', wifUnCompress);
    console.log(' - Public key: ', account.public);
    console.log(' - Address: ', account.address);
  }
})();