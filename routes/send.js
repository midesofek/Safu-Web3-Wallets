const { sendETH, sendToken } = require("../helpers/sendTransaction");

async function sendRoutes(app) {
  // Send ETH
  app.post("/wallet/send-eth", async (req, reply) => {
    try {
      const { userId, password, to, amount } = req.body;
      const tx = await sendETH(userId, password, to, amount);
      reply.send({ success: true, txHash: tx.hash });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });

  // Send Token (ERC20)
  app.post("/wallet/send-token", async (req, reply) => {
    try {
      const { userId, password, tokenAddress, to, amount } = req.body;
      const tx = await sendToken(userId, password, tokenAddress, to, amount);
      reply.send({ success: true, txHash: tx.hash });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });
}

module.exports = sendRoutes;
