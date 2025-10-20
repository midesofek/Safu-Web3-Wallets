const {
  getWalletTransactions,
  getWalletETHBalance,
} = require("../helpers/walletData");

async function walletDataRoutes(app) {
  app.get("/wallet/balance/:address", async (req, reply) => {
    try {
      const { address } = req.params;
      const result = await getWalletETHBalance(address);
      reply.send({ success: true, ...result });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });

  app.get("/wallet/transactions/:address", async (req, reply) => {
    try {
      const { address } = req.params;
      const txs = await getWalletTransactions(address);
      reply.send({ success: true, transactions: txs });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });
}

module.exports = walletDataRoutes;
