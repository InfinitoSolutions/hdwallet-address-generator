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

  let masterKey = await HDWallet.exportMasterPublicKey(answers.passphrase, answers.password, answers.network);
  if (!masterKey)
    console.log(' - Can not create master key');
  else {
    console.log(' - Master public key:', masterKey.masterPublicKey);
    console.log(' - Master chain code:', masterKey.masterChainCode);
  }
})();