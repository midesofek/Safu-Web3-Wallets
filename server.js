const Fastify = require("fastify");
require("dotenv").config();
require("./utils/database");
const walletRoutes = require("./routes/wallet");
const authRoutes = require("./routes/auth");
const walletDataRoutes = require("./routes/walletData");
const sendRoutes = require("./routes/send");
const transactionStatusRoutes = require("./routes/txnStatus");

const app = Fastify({ logger: true });

app.register(walletRoutes);
app.register(authRoutes);
app.register(walletDataRoutes);
app.register(sendRoutes);
app.register(transactionStatusRoutes);

const start = async () => {
  try {
    await app.listen({ port: process.env.PORT });
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
