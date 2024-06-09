import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export function StripePub () {
    const stripePromise = loadStripe(
        'YOUR_PUBLIC_STRIPE_KEY'
    );

    return (
        <Elements stripe={stripePromise}>
        </Elements>
    )
    
}