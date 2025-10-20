const { ethers } = require("ethers");
const UserWallet = require("../models/UserWallet");
const { decryptWithPassword } = require("../utils/crypto");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_RPC_URL
);

// ========== SEND ETH ==========
async function sendETH(userId, password, to, amount) {
  const walletDoc = await UserWallet.findOne({ userId });
  if (!walletDoc) throw new Error("Wallet not found");

  const mnemonic = decryptWithPassword(walletDoc.encryptedSeed, password);
  if (!mnemonic) throw new Error("Invalid password");

  const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

  const tx = {
    to,
    value: ethers.utils.parseEther(amount.toString()),
  };

  const gasEstimate = await provider.estimateGas({
    ...tx,
    from: wallet.address,
  });

  tx.gasLimit = gasEstimate;

  const sentTx = await wallet.sendTransaction(tx);
  return sentTx;
}

// ========== SEND ERC20 ==========
async function sendToken(userId, password, tokenAddress, to, amount) {
  const walletDoc = await UserWallet.findOne({ userId });
  if (!walletDoc) throw new Error("Wallet not found");

  const mnemonic = decryptWithPassword(walletDoc.encryptedSeed, password);
  if (!mnemonic) throw new Error("Invalid password");

  const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

  const erc20Abi = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)",
  ];

  const token = new ethers.Contract(tokenAddress, erc20Abi, wallet);
  const decimals = await token.decimals();

  const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimals);
  const tx = await token.transfer(to, parsedAmount);

  return tx;
}

module.exports = { sendETH, sendToken };
