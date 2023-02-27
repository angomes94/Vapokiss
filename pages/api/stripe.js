import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {

            const {cartItems, validCoupon} = req.body;
            const discounts = [];
            

                if (validCoupon && validCoupon.id) {
                    discounts.push({coupon: req.body.validCoupon.id});
                }
            
            let shipping_options = [];

            const line_items = cartItems;
            let total_amount = 0;
            for (const item of line_items) {
                total_amount += item.price * item.quantity;
            }

            if (total_amount >= 40) {
                shipping_options = [
                    { 
                     shipping_rate: 'shr_1MSISAJFNgzNJo7siPTib78v'
                    }
                ];
            } else {
                shipping_options = [
                    {
                        shipping_rate: "shr_1MSIR5JFNgzNJo7sGDGalS4u"
                    }
                ];
            }

            const params = {
                submit_type: 'pay',
                mode: 'payment',
                phone_number_collection: {
                  enabled: true,
                },
                discounts: discounts,
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_address_collection: {
                allowed_countries: ["PT"]
                },
                shipping_options: shipping_options,
                line_items: cartItems.map((item) => {

                  let description = "";

                  if(item.isBox && item.firstFlavour && item.secondFlavour){
                    console.log(item)
                    description = `${item.firstFlavour} ${item.secondFlavour}`
                  }else {
                    description = item.name
                  }
                    const img = item.image[0].asset._ref;
                    const newImage = img
                        .replace(
                            'image-',
                            'https://cdn.sanity.io/images/asywg11x/production/'
                        )
                        .replace('-png', '.png');

                    return {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: item.name,
                                images: [newImage],
                                description: description
                            },
                            unit_amount: item.price * 100
                        },
                        quantity: item.quantity
                    }
                }),
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/`
            }

            const session = await stripe
                .checkout
                .sessions
                .create(params);

            res
                .status(200)
                .json(session);
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res
            .status(405)
            .end('Method Not Allowed');
    }
}