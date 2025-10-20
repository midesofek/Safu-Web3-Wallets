const { createUser } = require("../helpers/authHelper");

async function authRoutes(app) {
  app.post("/auth/create", async (req, reply) => {
    try {
      const { password } = req.body;
      if (!password) throw new Error("Password required");

      const user = await createUser(password);
      reply.send({ success: true, userId: user.userId });
    } catch (err) {
      reply.status(400).send({ success: false, message: err.message });
    }
  });
}

module.exports = authRoutes;
