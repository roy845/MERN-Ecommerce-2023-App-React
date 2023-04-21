import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/AdminMenu";
import Layout from "../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const GET_PRODUCT_URL = "/api/v1/product/get-product";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllProducts = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(GET_PRODUCT_URL);
      setIsLoading(false);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h1 className="text-center"> All Products List</h1>
              <div className="d-flex flex-wrap">
                {products?.map((product) => (
                  <ProductCard product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Products;
