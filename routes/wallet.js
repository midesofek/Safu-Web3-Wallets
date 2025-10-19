const { createWallet, importWallet } = require("../helpers/setupWallet");

async function walletRoutes(app) {
  app.post("/wallet/create", async (req, reply) => {
    try {
      const result = await createWallet();
      reply.send({
        success: true,
        address: result.address,
        mnemonic: result.mnemonic,
      });
    } catch (err) {
      reply.status(500).send({ success: false, message: err.message });
    }
  });

  app.post("/wallet/import", async (req, reply) => {
    try {
      const { mnemonic } = req.body;
      const result = await importWallet(mnemonic);
      reply.send({ success: true, address: result.address });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });
}

module.exports = walletRoutes;
