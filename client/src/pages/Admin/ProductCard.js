import React from "react";
import { Link } from "react-router-dom";

const BASE_IMAGE_URL = "/api/v1/product/product-photo/";

const ProductCard = ({ product }) => {
  return (
    <Link
      key={product._id}
      to={`/dashboard/admin/products/${product.slug}`}
      className="product-link"
    >
      <div className="card m-2" style={{ width: "18rem" }}>
        <div className="card-body">
          <img
            src={`${BASE_IMAGE_URL}${product._id}?t=${Date.now()}`}
            className="card-img-top"
            alt={product.name}
          />
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.description}</p>
            <p className="card-text"> $ {product.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
