import React, {useState} from 'react';
import {AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai';
import toast from 'react-hot-toast';

import {client, urlFor} from '../../lib/client';
import {Product} from '../../components';
import {useStateContext} from '../../context/StateContext';

const ProductDetails = ({product, products}) => {

    const [productNames, setProductNames] = useState([])
    const [firstFlavour, setfirstFlavour] = useState("")
    const [secondFlavour, setsecondFlavour] = useState("")
    const [checkIfBox, setcheckIfBox] = useState(false)

    const {image, name, details, price} = product;
    const [index, setIndex] = useState(0);
    const {decQty, incQty, qty, onAdd, setShowCart} = useStateContext();
    

    if (!product) {
        return <h1>Product not found</h1>
    }

   

    if (!checkIfBox && product.isBox) {
        console.log("it's a box")
        const nonBoxProductNames = products
            .filter(p => !p.isBox)
            .map(p => p.name)
        setProductNames(nonBoxProductNames)
        setcheckIfBox(true)
    }

    const setBoxFlavours = () => {
        return Object.assign({}, product, {
            firstFlavour: firstFlavour,
            secondFlavour: secondFlavour
        })
    }

    const handleBuyNow = () => {
        if (product.isBox) {
            if (firstFlavour && secondFlavour) {
                product = setBoxFlavours()
            } else {
                toast.error("Por favor selecione os dois sabores");
                return;
            }
        }
        onAdd(product, qty);
        setShowCart(true);
    }

    const addToCart = () => {
        if (product.isBox) {
            if (firstFlavour && secondFlavour) {
                product = setBoxFlavours()
            } else {
                toast.error("Por favor selecione os dois sabores");
                return;
            }
        }
        onAdd(product, qty);
    }

    return (
        <div>
            <div className="product-detail-container">
                <div>
                    <div className="image-container">
                        <img src={urlFor(image && image[index])} className="product-detail-image"/>
                    </div>
                    <div className="small-images-container">
                        {
                            image
                                ?.map((item, i) => (
                                    <img
                                        key={i}
                                        src={urlFor(item)}
                                        className={i === index
                                            ? 'small-image selected-image'
                                            : 'small-image'}
                                        onMouseEnter={() => setIndex(i)}/>
                                ))
                        }
                    </div>
                </div>

                <div className="product-detail-desc">
                    <h1>{name}</h1>
                    <h4>Detalhes:</h4>
                    <p>{details}</p>
                    <p className="price">{price}
                        €</p>
                    <div className="quantity">
                        <h3>Quantidade:</h3>
                        <p className="quantity-desc">
                            <span className="minus" onClick={decQty}><AiOutlineMinus/></span>
                            <span className="num">{qty}</span>
                            <span className="plus" onClick={incQty}><AiOutlinePlus/></span>
                        </p>
                    </div>

                    {
                        product.isBox && (
                            <div className='product-box'>
                                <h1>Escolha dois sabores</h1>
                                <div className='product-box-form'>
                                    <form>
                                        <select value={firstFlavour} onChange={e => setfirstFlavour(e.target.value)}>
                                            <option value="" disabled="disabled" selected="selected">Primeiro sabor</option>
                                            {
                                                productNames.map(
                                                    (name, index) => (<option key={index} value={name}>{name}</option>)
                                                )
                                            }
                                        </select>

                                        <select value={secondFlavour} onChange={e => setsecondFlavour(e.target.value)}>
                                            <option value="" disabled="disabled" selected="selected">Segundo sabor</option>
                                            {
                                                productNames.map(
                                                    (name, index) => (<option key={index} value={name}>{name}</option>)
                                                )
                                            }
                                        </select>
                                    </form>      
                                </div>
                                <p>Apenas dois sabores podem ser selecionados</p>
                            </div>
                        )
                    }

                    <div className="buttons">
                        <button type="button" className="add-to-cart" onClick={addToCart}>Adicionar ao carrinho</button>
                        <button type="button" className="buy-now" onClick={handleBuyNow}>Comprar já</button>
                    </div>
                </div>
            </div>

            <div className="maylike-products-wrapper">
                <h2>Produtos semelhantes:</h2>
                <div className="marquee">
                    <div className="maylike-products-container track">
                        {products.map((item) => (<Product key={item._id} product={item}/>))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getStaticPaths = async () => {
    // Query all the products from the "product1" schema
    const query1 = `*[_type == "product"] {slug {current}}`;
    const products1 = await client.fetch(query1);

    // Query all the products from the "product2" schema
    const query2 = `*[_type == "product2"] {slug {current}}`;
    const products2 = await client.fetch(query2);

    // Combine the products from the different schemas into a single array
    const allProducts = [
        ...products1,
        ...products2
    ];

    // Generate the paths for each product
    const paths = allProducts.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }));

    return {paths, fallback: 'blocking'}
}

export const getStaticProps = async ({params: {
        slug
    }}) => {
    let product,
        products;

    try {
        // Check if the product is in the "product" schema
        const productInProductSchema = await client.fetch(
            `*[_type == "product" && slug.current == '${slug}'][0]`
        );
        if (productInProductSchema) {
            product = productInProductSchema;
            products = await client.fetch('*[_type == "product"]');
        } else {
            // Check if the product is in the "product2" schema
            const productInProduct2Schema = await client.fetch(
                `*[_type == "product2" && slug.current == '${slug}'][0]`
            );
            if (productInProduct2Schema) {
                product = productInProduct2Schema;
                products = await client.fetch('*[_type == "product2"]');
            } else {
                // If the product is not in either schema, return an empty object
                return {props: {}};
            }
        }
    } catch (error) {
        console.log(error);
        return {props: {}};
    }

    return {
        props: {
            products,
            product
        }
    };
}

export default ProductDetails