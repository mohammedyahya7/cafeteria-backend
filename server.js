import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Root route for testing
app.get("/", (req, res) => {
  res.send("I love you my bella Sofia scoriga");
});

// Create connection token
app.post("/connection_token", async (req, res) => {
  try {
    const token = await stripe.terminal.connectionTokens.create();
    res.json({ secret: token.secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create payment intent (amount in pence for GBP)
app.post("/create_payment_intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      payment_method_types: ["card_present"],
    });
    res.json({ client_secret: intent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
