import React from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";

const BASE_IMAGE_URL = "/api/v1/product/product-photo/";

const ProductCardUser = ({ product }) => {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const { auth, setAuth } = useAuth();

  return (
    <div className="card m-2 text-center" style={{ width: "18rem" }}>
      <img
        src={`${BASE_IMAGE_URL}${product._id}?t=${Date.now()}`}
        className="card-img-top"
        alt={product.name}
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description.substring(0, 30)}...</p>
        <p className="card-text"> $ {product.price}</p>
        <button
          className="btn btn-primary ms-1"
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          More Details
        </button>
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
  );
};

export default ProductCardUser;
