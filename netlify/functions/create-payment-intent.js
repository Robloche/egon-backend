// Stripe private key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async(event) => {
  console.log(event);

  try {
    const intent = await stripe.paymentIntents.create({
      amount: 2000, // En centimes (20,00 € ici)
      automatic_payment_methods: { enabled: true },
      currency: 'eur',
    });

    return {
      body: JSON.stringify({ clientSecret: intent.client_secret }),
      statusCode: 200,
    };
  } catch (err) {
    return {
      body: JSON.stringify({ error: err.message }),
      statusCode: 500,
    };
  }
};
