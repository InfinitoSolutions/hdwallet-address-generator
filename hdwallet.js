const Bip32 = require('bip32');
const Bitcoinjs = require('bitcoinjs-lib');
const EthWallet = require('ethereumjs-wallet');
const Constant = require('./constant')
const wif = require('wif')
const utils = require('./lib/util')

let HD = {
  /**
   *  Export master private key form mnemonic & password
   *
   * @param {*} mnemonic
   * @param {*} password
   * @param {*} net MAINNET/TESTNET
   * @returns
   */
  exportMasterPrivateKey: async(mnemonic, password, net) => {
    if (!utils.isPassphrase(mnemonic))
      return null
    let seed = await utils.genSeed(mnemonic, password)
    let network = Bitcoinjs.networks.bitcoin
    if (net == Constant.network.TESTNET)
      network = Bitcoinjs.networks.testnet
    let masterKeyPair = Bip32.fromSeed(seed, network);
    let masterPrivateKey = masterKeyPair.privateKey.toString('hex');

    return {
      masterPrivateKey: masterPrivateKey,
      masterPrivateKeyWif: HD.convertToWIF(masterPrivateKey, net, true),
      masterPrivateKeyWifUncompress: HD.convertToWIF(masterPrivateKey, net, false),
      masterPublicKey: masterKeyPair.publicKey.toString('hex'),
      masterChainCode: masterKeyPair.chainCode.toString('hex')
    }
  },

  /**
   * Export master public key & chain code from mnemonic
   *
   * @param {*} mnemonic
   * @param {*} password
   * @param {*} net MAINNET/TESTNET
   * @returns
   */
  exportMasterPublicKey: async(mnemonic, password, net) => {
    if (!utils.isPassphrase(mnemonic))
      return null
    let seed = await utils.genSeed(mnemonic, password)
    let network = Bitcoinjs.networks.bitcoin
    if (net == Constant.network.TESTNET)
      network = Bitcoinjs.networks.testnet
    let masterKeyPair = Bip32.fromSeed(seed, network)
    return {
      masterPublicKey: masterKeyPair.publicKey.toString('hex'),
      masterChainCode: masterKeyPair.chainCode.toString('hex')
    }
  },

  /**
   * Export child private key
   *
   * @param {*} mnemonic
   * @param {*} platform ETH/BTC/USDT
   * @param {*} index
   * @param {*} password
   * @param {*} net MAINNET/TESTNET
   * @returns
   */
  exportChildKey: async(mnemonic, platform, index, password, net) => {
    if (!utils.isPassphrase(mnemonic))
      return null
    let seed = await utils.genSeed(mnemonic, password)
    let network = Bitcoinjs.networks.bitcoin
    if (net == Constant.network.TESTNET)
      network = Bitcoinjs.networks.testnet
    let masterKeyPair = Bip32.fromSeed(seed, network)
    if (platform == Constant.platform.BTC || platform == Constant.platform.USDT) {
      let coinIndex = "0"
      if (platform == Constant.platform.USDT) {
        // omni platform
        coinIndex = "200"
      }
      let hdPath = "m/44/" + coinIndex + "/0/0/" + index;
      let masterAccount = masterKeyPair
      let account = masterAccount.derivePath(hdPath);
      return {
        private: account.privateKey.toString('hex'),
        public: account.publicKey.toString('hex'),
        address: Bitcoinjs.payments.p2pkh({
          pubkey: account.publicKey,
          network: network
        }).address
      }
    } else if (platform == Constant.platform.ETH) {
      let coinIndex = "60"
      let hdPath = "m/44/" + coinIndex + "/0/0/" + index;
      let masterAccount = masterKeyPair
      let account = masterAccount.derivePath(hdPath);
      return {
        private: account.privateKey.toString('hex'),
        public: account.publicKey.toString('hex'),
        address: EthWallet.fromPublicKey(account.publicKey, true).getAddressString()
      }
    } else {
      return null
    }
  },

  /**
   * Export child address
   *
   * @param {*} masterPublicKey
   * @param {*} masterChainCode
   * @param {*} platform
   * @param {*} index
   * @param {*} net MAINNET/TESTNET
   * @returns
   */
  exportChildAddress: async(masterPublicKey, masterChainCode, platform, index, net) => {
    if (!masterPublicKey || !masterChainCode)
      return null
    let network = Bitcoinjs.networks.bitcoin
    if (net == Constant.network.TESTNET)
      network = Bitcoinjs.networks.testnet
    try {
      let masterKeyPair = Bip32.fromPublicKey(masterPublicKey, masterChainCode, network)
      if (platform == Constant.platform.BTC || platform == Constant.platform.USDT) {
        let coinIndex = "0"
        if (platform == Constant.platform.USDT) {
          // omni platform
          coinIndex = "200"
        }
        let hdPath = "m/44/" + coinIndex + "/0/0/" + index;
        let masterAccount = masterKeyPair
        let account = masterAccount.derivePath(hdPath);
        return {
          public: account.publicKey.toString('hex'),
          address: Bitcoinjs.payments.p2pkh({
            pubkey: account.publicKey,
            network: network
          }).address
        }
      } else if (platform == Constant.platform.ETH) {
        let coinIndex = "60"
        let hdPath = "m/44/" + coinIndex + "/0/0/" + index;
        let masterAccount = masterKeyPair
        let account = masterAccount.derivePath(hdPath);
        return {
          public: account.publicKey.toString('hex'),
          address: EthWallet.fromPublicKey(account.publicKey, true).getAddressString()
        }
      } else {
        return null
      }
    } catch (e) {
      return null
    }
  },

  /**
   * Private key to wif
   *
   * @param {*} privateHex
   * @param {*} network
   * @param {boolean} [compress=true]
   * @returns
   */
  convertToWIF: (privateHex, network, compress = true) => {

    let privateKey = null;
    if (typeof(privateHex) == "string") {
        privateKey = Buffer.from(privateHex, 'hex');
    } else if (Buffer.isBuffer(privateHex)) {
        privateKey = privateHex;
    } else {
        return null;
    }

    if (!utils.isPrivateKey(privateKey)) {
        return null;
    } 

    let version = network == Constant.network.TESTNET ? 239 : 128;
    return wif.encode(version, privateKey, compress)
  }
}

module.exports = HD;