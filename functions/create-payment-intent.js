// domain/.netlify/functions/create-payment-intent

require("dotenv").config();

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
	if (event.body) {
		const { cart, shipping_fee, total_amount } = JSON.parse(event.body);
		console.log(cart);

		const calulateOrderAmount = () => {
			return shipping_fee + total_amount;
		};

		try {
			const paymentIntent = await stripe.paymentIntents.create({
				amount: calulateOrderAmount(),
				currency: "usd",
			});
			return {
				statusCode: 200,
				body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
			};
		} catch (e) {
			return {
				statusCode: 500,
				body: JSON.stringify({ message: e.message }),
			};
		}
	}
	return {
		statusCode: 200,
		body: "Create payment intent",
	};
};
