const {
  generateMnemonic,
  mnemonicToEntropy,
} = require("ethereum-cryptography/bip39");
const { HDKey } = require("ethereum-cryptography/hdkey");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { wordlist } = require("ethereum-cryptography/bip39/wordlists/english");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");

// generates mnemonic using the Bitcoin Improvement Proposal 39
function _generateMnemonic() {
  const strength = 128; // 256 bits, 24 words; default is 128 bits, 12 words
  const mnemonic = generateMnemonic(wordlist, strength);
  const entropy = mnemonicToEntropy(mnemonic, wordlist);
  return { mnemonic, entropy };
}

// generate rook jey from mnemonic
function _getHdRootKey(_mnemonic) {
  return HDKey.fromMasterSeed(_mnemonic);
}

secp256k1;
function _generatePrivateKey(_hdRootKey, _accountIndex) {
  return _hdRootKey.deriveChild(_accountIndex).privateKey;
}

function _getPublicKey(_privateKey) {
  return secp256k1.getPublicKey(_privateKey);
}

function _getEthAddress(_publicKey) {
  return keccak256(_publicKey).slice(-20);
}

async function createEVMWallet() {
  const { mnemonic, entropy } = _generateMnemonic();
  console.log(`WARNING! Never disclose your Seed Phrase:\n ${mnemonic}`);

  const hdRootKey = _getHdRootKey(entropy);
  const accountOneIndex = 0;
  const accountOnePrivateKey = _generatePrivateKey(hdRootKey, accountOneIndex);
  const accountOnePublicKey = _getPublicKey(accountOnePrivateKey);
  const accountOneAddress = _getEthAddress(accountOnePublicKey);
  console.log(`Account One Wallet Address: 0x${bytesToHex(accountOneAddress)}`);
}

module.exports = createEVMWallet;
