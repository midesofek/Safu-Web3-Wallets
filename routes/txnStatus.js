const { getTransactionStatus } = require("../helpers/txnStatus");

async function transactionStatusRoutes(app) {
  app.get("/wallet/tx-status/:txHash", async (req, reply) => {
    try {
      const { txHash } = req.params;
      const status = await getTransactionStatus(txHash);
      reply.send({ success: true, ...status });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });
}

module.exports = transactionStatusRoutes;
