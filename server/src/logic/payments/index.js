var stripeInit = require('stripe');

export let stripe = stripeInit(process.env.STRIPE_SECRET_KEY);