import React, {useRef, useState} from 'react';
import Link from 'next/link';
import {AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping, AiFillTag} from 'react-icons/ai';
import {TiDeleteOutline} from 'react-icons/ti';
import toast from 'react-hot-toast';

import {useStateContext} from '../context/StateContext';
import {urlFor} from '../lib/client';
import getStripe from '../lib/getStripe';

const Cart = () => {
    const cartRef = useRef();
    const {
        totalPrice,
        totalQuantities,
        cartItems,
        setShowCart,
        toggleCartItemQuanitity,
        onRemove
    } = useStateContext();
    const [showAddCouponButton, setShowAddCouponButton] = useState(true);
    const [addCoupon, setaddCoupon] = useState(false);
    const [coupontext, setCouponText] = useState('');
    const [isCouponAdded, setisCouponAdded] = useState(false);
    const [validCoupon, setValidCoupon] = useState(null);

    const handleChange = (event) => {
        setCouponText(event.target.value);
    };

    const checkCoupon = async () => {
        if (!isCouponAdded) {
            const response = await fetch('https://api.stripe.com/v1/coupons', {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`
                }
            });

            if (!response.ok) {
                toast.error("Error fetching coupons");
                return;
            }

            const {data} = await response.json();
            console.log(data);
            const validcoupon = data.find((c) => c.id === coupontext);
            if (validcoupon && validcoupon.id === "OFERTA1") {
                if (totalQuantities >= 4) {
                    setValidCoupon(validcoupon);
                    setisCouponAdded(true);
                    toast.success("Cupão é valido, desconto será aplicado no checkout")
                } else if (totalQuantities < 4) {
                    toast.error("Para utilizar este cupão tem de adicionar 4 produtos ao carrinho");
                }
            } else if (validcoupon) {
                toast.success("Cupão é valido, desconto será aplicado no checkout")
                setValidCoupon(validcoupon);
                setisCouponAdded(true);
            } else {
                toast.error("Cupão não é valido");
            }
        } else {
            toast.success("Já tem um cupão adicionado");
        }

    }

    const handleCheckout = async () => {
        const stripeClient = await getStripe();
        const response = await fetch('/api/stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cartItems, validCoupon})
        });

        if (response.statusCode === 500) 
            return;
        
        const data = await response.json();

        toast.loading('Redirecionando...');

        stripeClient.redirectToCheckout({sessionId: data.id});
    }

    return (
        <div className="cart-wrapper" ref={cartRef}>
            <div className="cart-container">
                <button
                    type="button"
                    className="cart-heading"
                    onClick={() => setShowCart(false)}>
                    <AiOutlineLeft/>
                    <span className="heading">Carrinho</span>
                    <span className="cart-num-items">({totalQuantities} artigos)</span>
                </button>

                {
                    cartItems.length < 1 && (
                        <div className="empty-cart">
                            <AiOutlineShopping size={150}/>
                            <h3>O seu carrinho está vazio</h3>
                            <Link href="/">
                                <button type="button" onClick={() => setShowCart(false)} className="btn">
                                    Continuar a comprar
                                </button>
                            </Link>
                        </div>
                    )
                }

                <div className="product-container">
                    {
                        cartItems.length >= 1 && cartItems.map((item) => (
                            <div className="product" key={item._id}>
                                <img
                                    src={urlFor(
                                        item
                                            ?.image[0]
                                    )}
                                    className="cart-product-image"/>
                                <div className="item-desc">
                                    <div className="flex top">
                                        <h5>{item.name}</h5>
                                        <h4>{item.price}€ c/IVA</h4>
                                    </div>
                                    <div className="flex bottom"> 
                                        <div>
                                            <p className="quantity-desc">
                                                <span
                                                    className="minus"
                                                    onClick={() => toggleCartItemQuanitity(item._id, 'dec')}>
                                                    <AiOutlineMinus/>
                                                </span>
                                                <span className="num">{item.quantity}</span>
                                                <span className="plus" onClick={() => toggleCartItemQuanitity(item._id, 'inc')}><AiOutlinePlus/></span>
                                            </p>
                                        </div>
                                        <button type="button" className="remove-item" onClick={() => onRemove(item)}>
                                            <TiDeleteOutline/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                {
                    cartItems.length >= 1 && (
                        <div className="cart-bottom">
                            <div className="total">
                                {
                                    showAddCouponButton && (
                                        <a
                                            href="#"
                                            onClick={() => {
                                                setaddCoupon(true);
                                                setShowAddCouponButton(false);
                                            }}>
                                            <AiFillTag/>Adicionar Cupão
                                        </a>
                                    )
                                }
                                {
                                    addCoupon && (
                                        <div className='coupon'>
                                            <input type="text" placeholder="Insira aqui o seu cupão" onChange={handleChange}/>
                                            <button
                                                onClick={() => {
                                                    checkCoupon();
                                                }}>Validar Cupão</button>
                                        </div>
                                    )
                                }
                                <h3>Subtotal:</h3>
                                <h3>{totalPrice}€ c/IVA</h3>
                            </div>
                            <div className="btn-container">
                                <button type="button" className="btn" onClick={handleCheckout}>
                                    Pagar com Cartão
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Cart