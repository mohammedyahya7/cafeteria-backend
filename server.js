import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Stripe with your secret key from .env file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --- ROUTE 1: Create connection token (for your iPad app) ---
app.post("/connection_token", async (req, res) => {
  try {
    const token = await stripe.terminal.connectionTokens.create();
    res.json({ secret: token.secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ROUTE 2: Create payment intent (for a specific amount) ---
app.post("/create_payment_intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      payment_method_types: ["card_present"],
    });
    res.json({ client_secret: intent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
