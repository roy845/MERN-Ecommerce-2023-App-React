import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import RelatedProductsCard from "../components/RelatedProductsCard";

const GET_PRODUCT_URL = "/api/v1/product/get-product/";
const GET_SIMILAR_PRODUCT_URL = "/api/v1/product/related-product/";
const BASE_IMAGE_URL = "/api/v1/product/product-photo/";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { cart, setCart } = useCart();

  //initial product details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //get product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${GET_PRODUCT_URL}${params.slug}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product?._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${GET_SIMILAR_PRODUCT_URL}${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`${BASE_IMAGE_URL}${product?._id}?t=${Date.now()}`}
            className="card-img-top"
            alt={product?.name}
          />
        </div>
        <div className="col-md-6">
          <h1 className="text-center">Product Details</h1>
          <h6>Name : {product?.name}</h6>
          <h6>Description : {product?.description}</h6>
          <h6>Price : $ {product?.price} </h6>
          <h6>Category : {product?.category?.name}</h6>
          <button
            className="btn btn-secondary ms-1"
            onClick={() => {
              setCart([...cart, product]);
              localStorage.setItem("cart", JSON.stringify([...cart, product]));
              toast.success("Item Added to cart");
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((product) => (
            <RelatedProductsCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
