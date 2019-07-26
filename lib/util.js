const EthWallet = require('ethereumjs-wallet');
const Bip39 = require('bip39');

module.exports = {
  /**
   * Validate private key
   *
   * @param {*} privateKey Hex
   * @returns
   */
  isPrivateKey: (privateKey) => {
    try {
      EthWallet.fromPrivateKey(privateKey)
      return true
    } catch (e) {
      return false
    }
  },
  /**
   * Validate passphrase
   *
   * @param {*} passphrase Passphrase
   * @returns
   */
  isPassphrase: (passphrase) => {
    return Bip39.validateMnemonic(passphrase)
  },
  /**
   * Generate seed from passphrase & password
   *
   * @param {*} mnemonic
   * @param {*} password
   * @returns
   */
  genSeed: async(mnemonic, password) => {
    if (password) {
      return await Bip39.mnemonicToSeed(mnemonic, password)
    } else {
      return await Bip39.mnemonicToSeed(mnemonic)
    }
  }
}