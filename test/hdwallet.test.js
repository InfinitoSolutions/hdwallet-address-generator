const Bip39 = require('bip39');
const Bip32 = require('bip32');
const Bitcoinjs = require('bitcoinjs-lib');
const EthWallet = require('ethereumjs-wallet');
const Constant = require('../constant')
const HdWallet = require('../hdwallet')
const assert = require('assert');

function randomString(strLength, charSet) {
  var result = [];
  strLength = strLength || 5;
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';

  while (--strLength) {
    result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
  }

  return result.join('');
}

describe('HD wallet test', function() {
  describe('Return master private key', function() {
    it('dont have password', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let masterKey = await HdWallet.exportMasterPrivateKey(passphrase, null)
      let seed = await Bip39.mnemonicToSeed(passphrase)
      assert.equal(masterKey.masterPrivateKey, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).privateKey.toString('hex'))
      assert.equal(masterKey.masterPublicKey, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).publicKey.toString('hex'))
      assert.equal(masterKey.masterChainCode, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).chainCode.toString('hex'))
    });
    it('have password', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = "Test$y0urP@sswd"
      let masterKey = await HdWallet.exportMasterPrivateKey(passphrase, password)
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      assert.equal(masterKey.masterPrivateKey, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).privateKey.toString('hex'))
      assert.equal(masterKey.masterPublicKey, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).publicKey.toString('hex'))
      assert.equal(masterKey.masterChainCode, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).chainCode.toString('hex'))
    });
    it('wrong passphrase', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver"
      let masterKey = await HdWallet.exportMasterPrivateKey(passphrase, null)
      assert.equal(masterKey, null)
    });

    it('BTC testnet', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let masterKey = await HdWallet.exportMasterPrivateKey(passphrase, null, Constant.network.TESTNET)
      let seed = await Bip39.mnemonicToSeed(passphrase)
      assert.equal(masterKey.masterPrivateKey, Bip32.fromSeed(seed, Bitcoinjs.networks.testnet).privateKey.toString('hex'))
      assert.equal(masterKey.masterPublicKey, Bip32.fromSeed(seed, Bitcoinjs.networks.testnet).publicKey.toString('hex'))
      assert.equal(masterKey.masterChainCode, Bip32.fromSeed(seed, Bitcoinjs.networks.testnet).chainCode.toString('hex'))
    });
  });
  describe('Return master public key', function() {
    it('dont have password', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let masterKey = await HdWallet.exportMasterPublicKey(passphrase, null)
      let seed = await Bip39.mnemonicToSeed(passphrase)
      assert.equal(masterKey.masterPublicKey, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).publicKey.toString('hex'))
      assert.equal(masterKey.masterChainCode, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).chainCode.toString('hex'))
    });
    it('have password', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = "Test$y0urP@sswd"
      let masterKey = await HdWallet.exportMasterPublicKey(passphrase, password)
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      assert.equal(masterKey.masterPublicKey, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).publicKey.toString('hex'))
      assert.equal(masterKey.masterChainCode, Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin).chainCode.toString('hex'))
    });
    it('wrong passphrase', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver"
      let masterKey = await HdWallet.exportMasterPublicKey(passphrase, null)
      assert.equal(masterKey, null)
    });
    it('BTC testnet', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let masterKey = await HdWallet.exportMasterPublicKey(passphrase, null, Constant.network.TESTNET)
      let seed = await Bip39.mnemonicToSeed(passphrase)
      assert.equal(masterKey.masterPublicKey, Bip32.fromSeed(seed, Bitcoinjs.networks.testnet).publicKey.toString('hex'))
      assert.equal(masterKey.masterChainCode, Bip32.fromSeed(seed, Bitcoinjs.networks.testnet).chainCode.toString('hex'))
    });
  });
  describe('export child key', function() {
    it('child ETH key', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      let childKey = await HdWallet.exportChildKey(passphrase, Constant.platform.ETH, 10, password)

      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)
      let hdPath = "m/44/60/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)

      assert.equal(childKey.private, expectChildKey.privateKey.toString('hex'))
      assert.equal(childKey.public, expectChildKey.publicKey.toString('hex'))
    });

    it('child BTC key', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      let childKey = await HdWallet.exportChildKey(passphrase, Constant.platform.BTC, 10, password)

      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)
      let hdPath = "m/44/0/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)

      assert.equal(childKey.private, expectChildKey.privateKey.toString('hex'))
      assert.equal(childKey.public, expectChildKey.publicKey.toString('hex'))
    });

    it('child testnet BTC key', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      let childKey = await HdWallet.exportChildKey(passphrase, Constant.platform.BTC, 10, password, Constant.network.TESTNET)

      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.testnet)
      let hdPath = "m/44/0/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)

      assert.equal(childKey.private, expectChildKey.privateKey.toString('hex'))
      assert.equal(childKey.public, expectChildKey.publicKey.toString('hex'))
    });

    it('child USDT key', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      let childKey = await HdWallet.exportChildKey(passphrase, Constant.platform.USDT, 10, password)

      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)
      let hdPath = "m/44/200/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)

      assert.equal(childKey.private, expectChildKey.privateKey.toString('hex'))
      assert.equal(childKey.public, expectChildKey.publicKey.toString('hex'))
    });

    it('child testnet USDT key', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      let childKey = await HdWallet.exportChildKey(passphrase, Constant.platform.USDT, 10, password, Constant.network.TESTNET)

      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.testnet)
      let hdPath = "m/44/200/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)

      assert.equal(childKey.private, expectChildKey.privateKey.toString('hex'))
      assert.equal(childKey.public, expectChildKey.publicKey.toString('hex'))
    });

    it('child testnet USDT key with wrong passphrase', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      let childKey = await HdWallet.exportChildKey('passphrase', Constant.platform.USDT, 10, password, Constant.network.TESTNET)

      assert.equal(childKey, null)
    });

    it('child testnet USDT key with wrong platform', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      let childKey = await HdWallet.exportChildKey(passphrase, 'Constant.platform.USDT', 10, password, Constant.network.TESTNET)

      assert.equal(childKey, null)
    });
  });
  describe('export child address', async function() {
    it('Return BTC testnet address', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.testnet)
      let hdPath = "m/44/0/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)
      let expectAddress = Bitcoinjs.payments.p2pkh({
        pubkey: expectChildKey.publicKey,
        network: Bitcoinjs.networks.testnet
      }).address

      let childPublicKey = await HdWallet.exportChildAddress(masterKey.publicKey, masterKey.chainCode, Constant.platform.BTC, 10, Constant.network.TESTNET)
      assert.equal(childPublicKey.address, expectAddress)
    });

    it('Public key is null', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));

      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)

      let childPublicKey = await HdWallet.exportChildAddress(null, masterKey.chainCode, Constant.platform.BTC, 10, "MAINNET")
      assert.equal(childPublicKey, null)
    });

    it('Chain code is null', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.testnet)

      let childPublicKey = await HdWallet.exportChildAddress(masterKey.publicKey, null, Constant.platform.BTC, 10, Constant.network.TESTNET)
      assert.equal(childPublicKey, null)
    });

    it('Return BTC address', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));

      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)
      let hdPath = "m/44/0/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)
      let expectAddress = Bitcoinjs.payments.p2pkh({
        pubkey: expectChildKey.publicKey,
        network: Bitcoinjs.networks.bitcoin
      }).address

      let childPublicKey = await HdWallet.exportChildAddress(masterKey.publicKey, masterKey.chainCode, Constant.platform.BTC, 10, "MAINNET")
      assert.equal(childPublicKey.address, expectAddress)
    });

    it('Return USDT testnet address', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));
      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.testnet)
      let hdPath = "m/44/200/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)
      let expectAddress = Bitcoinjs.payments.p2pkh({
        pubkey: expectChildKey.publicKey,
        network: Bitcoinjs.networks.testnet
      }).address

      let childPublicKey = await HdWallet.exportChildAddress(masterKey.publicKey, masterKey.chainCode, Constant.platform.USDT, 10, Constant.network.TESTNET)
      assert.equal(childPublicKey.address, expectAddress)
    });

    it('Return USDT address', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));

      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)
      let hdPath = "m/44/200/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)
      let expectAddress = Bitcoinjs.payments.p2pkh({
        pubkey: expectChildKey.publicKey,
        network: Bitcoinjs.networks.bitcoin
      }).address

      let childPublicKey = await HdWallet.exportChildAddress(masterKey.publicKey, masterKey.chainCode, Constant.platform.USDT, 10, Constant.network.MAINNET)
      assert.equal(childPublicKey.address, expectAddress)
    });

    it('Return ETH address', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));

      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)
      let hdPath = "m/44/60/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)
      let account = EthWallet.fromPrivateKey(expectChildKey.privateKey)

      let childPublicKey = await HdWallet.exportChildAddress(masterKey.publicKey, masterKey.chainCode, Constant.platform.ETH, 10, Constant.network.MAINNET)
      assert.equal(childPublicKey.address, `0x${account.getAddress().toString('hex')}`)
    });

    it('Return ETH address with wrong platform', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));

      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)
      let hdPath = "m/44/60/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)
      let account = EthWallet.fromPrivateKey(expectChildKey.privateKey)

      let childPublicKey = await HdWallet.exportChildAddress(masterKey.publicKey, masterKey.chainCode, 'Constant.platform.USDT', 10, Constant.network.MAINNET)
      assert.equal(childPublicKey, null)
    });

    it('Return ETH address with wrong masterKey chainCode', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));

      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)
      let hdPath = "m/44/60/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)
      let account = EthWallet.fromPrivateKey(expectChildKey.privateKey)

      let childPublicKey = await HdWallet.exportChildAddress(masterKey.publicKey, 'masterKey.chainCode', Constant.platform.USDT, 10, Constant.network.MAINNET)
      assert.equal(childPublicKey, null)
    });

    it('Return ETH address with wrong masterKey publicKey', async function() {
      let passphrase = "expand permit drop enact car half foot spare matter deliver undo leader"
      let password = randomString(8 + Math.floor(Math.random() * 10));

      // generate address of child which has index is 10
      let seed = await Bip39.mnemonicToSeed(passphrase, password)
      let masterKey = Bip32.fromSeed(seed, Bitcoinjs.networks.bitcoin)
      let hdPath = "m/44/60/0/0/" + "10";
      let expectChildKey = masterKey.derivePath(hdPath)
      let account = EthWallet.fromPrivateKey(expectChildKey.privateKey)

      let childPublicKey = await HdWallet.exportChildAddress('masterKey.publicKey', masterKey.chainCode, Constant.platform.USDT, 10, Constant.network.MAINNET)
      assert.equal(childPublicKey, null)
    });

  });
  describe('Convert private key to wif', function() {
    it('invalid private key type', function() {
      const privateKey = 123;
      let wif = HdWallet.convertToWIF(privateKey)
      assert.equal(wif, null, 'Can not export empty key')
    })
    it('empty private key', function() {
      const privateKey = Buffer.from(
        '',
        'hex',
      )
      let wif = HdWallet.convertToWIF(privateKey)
      assert.equal(wif, null, 'Can not export empty key')
    })
    it('export correct private key', function() {
      const privateKey = Buffer.from(
        '487D58803E04B6A100AB8FAEB0350E90E49CF66C3F960F6F5196DB85F221DE08',
        'hex',
      )
      let wif = HdWallet.convertToWIF(privateKey)
      assert.equal(wif, 'Kyecz9WnWPFJQ47Quy7fnZeQJP2siAFQ3b1nDnMu1uwfh2tKpLej', 'Can not export wif format')
    })
    it('export wrong private key', function() {
      const privateKey = Buffer.from(
        '487D58803E04B6A100AB8FAEB0350E90E49CF66C3F960F6F',
        'hex',
      )
      let wif = HdWallet.convertToWIF(privateKey)
      assert.equal(wif, null, 'Can not export wrong format key')
    })
    it('export testnet private key', function() {
      const privateKey = Buffer.from(
        '487D58803E04B6A100AB8FAEB0350E90E49CF66C3F960F6F5196DB85F221DE08',
        'hex',
      )
      let wif = HdWallet.convertToWIF(privateKey, 'TESTNET')
      assert.equal(wif, 'cQ1cT4WdwSwZZVagJNvo9t9TvcLHNcM67dAFLCpQX2bfwn4BA2nW', 'Can not export wif format')
    })
  });
});