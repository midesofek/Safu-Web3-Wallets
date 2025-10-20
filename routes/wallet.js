const {
  createWallet,
  importWallet,
  recoverWallet,
} = require("../helpers/setupWallet");

async function walletRoutes(app) {
  app.post("/wallet/create", async (req, reply) => {
    try {
      const { userId, password } = req.body;
      const result = await createWallet(userId, password);
      reply.send({
        success: true,
        address: result.address,
        mnemonic: result.mnemonic,
        userId: userId,
      });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });

  app.post("/wallet/import", async (req, reply) => {
    try {
      const { userId, password, mnemonic } = req.body;
      const result = await importWallet(userId, password, mnemonic);
      reply.send({ success: true, address: result.address });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });

  app.post("/wallet/recover", async (req, reply) => {
    try {
      const { userId, password } = req.body;
      const result = await recoverWallet(userId, password);
      reply.send({ success: true, mnemonic: result.mnemonic });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });
}

module.exports = walletRoutes;
