import stripe
from app.config import Config

stripe.api_key = Config.STRIPE_API_KEY

# Create a successful test payment intent
payment_intent = stripe.PaymentIntent.create(
    amount=2000,  # $20.00
    currency="usd",
    payment_method_types=["card"],
    payment_method="pm_card_visa",  # This is a test card token
    confirm=True,  # Automatically confirm the payment
)

# Output the ID for use in refund testing
print("Payment Intent ID for refund testing:", payment_intent.id)
# Example output: "Payment Intent ID for refund testing: pi_3NkTP2LkdIwHu7Ix1geLJEfS"