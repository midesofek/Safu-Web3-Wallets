const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_RPC_URL
);

async function getTransactionStatus(txHash) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return { status: "pending" };
    }

    return {
      status: receipt.status === 1 ? "confirmed" : "failed",
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed?.toString(),
      confirmations: receipt.confirmations,
    };
  } catch (err) {
    throw new Error("Unable to fetch transaction status: " + err.message);
  }
}

module.exports = { getTransactionStatus };
