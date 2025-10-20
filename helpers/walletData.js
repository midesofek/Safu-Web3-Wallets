const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_RPC_URL || "https://ethereum.publicnode.com"
);

const getWalletETHBalance = async (address) => {
  try {
    const balance = await provider.getBalance(address);
    const formatted = ethers.utils.formatEther(balance);
    return { balance: formatted };
  } catch (err) {
    throw new Error("Failed to fetch balance");
  }
};

/**
 * Fetches wallet transactions from Zerion API.
 * Falls back to Etherscan if Zerion fails or returns empty.
 * @param {string} walletAddress - The wallet address to fetch transactions for
 * @param {number} [limit=20] - Number of transactions to return
 * @returns {Promise<Array>} - Array of transaction objects
 */
async function getWalletTransactions(walletAddress, limit = 20) {
  if (!walletAddress) throw new Error("Wallet address is required");

  let transactions = [];

  try {
    console.log(`Fetching transactions from Zerion for ${walletAddress}...`);

    let url = `https://api.zerion.io/v1/wallets/${walletAddress}/transactions/?currency=usd&page[size]=100&filter[trash]=only_non_trash`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        // e.g. "Basic <encoded>"
        authorization: `Basic ${process.env.ZERION_API_KEY}`,
      },
    };

    let allTransactionData = [];

    while (url) {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Zerion API error");

      const data = await res.json();
      const transactionData = data?.data || [];
      allTransactionData.push(...transactionData);

      // Pagination cursor
      url = data?.links?.next || null;
    }

    transactions = allTransactionData.map((txn) => ({
      hash: txn?.id,
      from: txn?.attributes?.sent_from,
      to: txn?.attributes?.sent_to,
      value:
        txn?.attributes?.transfers?.[0]?.quantity?.float?.toString() || "0",
      symbol: txn?.attributes?.transfers?.[0]?.fungible_info?.symbol || "",
      type: txn?.attributes?.operation_type,
      timestamp: txn?.attributes?.mined_at || txn?.attributes?.created_at,
      status: txn?.attributes?.status || "confirmed",
    }));

    if (transactions.length > 0) {
      console.log(`✅ Zerion returned ${transactions.length} transactions`);
      return transactions.slice(0, limit);
    }

    console.log("⚠️ No transactions found on Zerion");
  } catch (err) {
    console.error("Zerion fetch failed:", err.message);
  }
}

/**
 * Fetch a wallet's portfolio data using Zerion API
 * @param {string} walletAddress - The wallet address
 * @returns {Promise<Object>} portfolio summary and asset breakdown
 */
async function getWalletPortfolio(walletAddress) {
  if (!walletAddress) throw new Error("Wallet address is required");

  const url = `https://api.zerion.io/v1/wallets/${walletAddress}/positions/?currency=usd`;
  const headers = {
    accept: "application/json",
    authorization: `Basic ${process.env.ZERION_API_KEY}`, // "Basic <encoded-key>"
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Zerion API error (${res.status})`);

    const data = await res.json();
    const positions = data?.data || [];

    // Extract key portfolio info
    const assets = positions.map((p) => {
      const attr = p.attributes;
      const token = attr?.fungible_info || {};

      return {
        name: token?.name || attr?.name,
        symbol: token?.symbol || attr?.symbol,
        quantity: attr?.quantity?.float || 0,
        price: attr?.price?.value || 0,
        valueUSD: attr?.value || 0,
        chain: attr?.chain,
        category: attr?.type || "token",
      };
    });

    // Compute portfolio totals
    const totalValue = assets.reduce((sum, a) => sum + (a.valueUSD || 0), 0);

    console.log(`✅ Portfolio fetched: ${assets.length} assets`);
    return {
      address: walletAddress,
      totalValueUSD: totalValue,
      assetCount: assets.length,
      assets,
    };
  } catch (err) {
    console.error("Zerion portfolio fetch failed:", err.message);
    throw new Error("Failed to fetch portfolio from Zerion");
  }
}

module.exports = {
  getWalletETHBalance,
  getWalletTransactions,
  getWalletPortfolio,
};
