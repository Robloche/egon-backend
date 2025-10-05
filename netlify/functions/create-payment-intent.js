import Stripe from 'stripe';

// Stripe private key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

const HEADERS = Object.freeze({
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
});

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    // Preflight requests (CORS)
    return {
      statusCode: 200,
      headers: HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ error: 'Unauthorized method' }),
    };
  }

  try {
    const { amount, currency } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: HEADERS,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
