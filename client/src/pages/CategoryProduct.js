import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCardUser from "../components/ProductCardUser";
import LoadingSpinner from "../components/LoadingSpinner";

const GET_PRODUCTS_BY_CATEGORY_URL = "/api/v1/product/product-category/";

const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const getProductsByCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${GET_PRODUCTS_BY_CATEGORY_URL}${params.slug}`
      );
      setLoading(false);
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.slug) getProductsByCategory();
  }, [params.slug]);

  return (
    <Layout>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mt-3">
          <h4 className="text-center">Category - {category?.name}</h4>
          <h6 className="text-center">{products?.length} result found</h6>
          <div className="row">
            <div className="col-md-9 offset-1">
              <div className="d-flex flex-wrap">
                {products?.map((product) => (
                  <ProductCardUser key={product._id} product={product} />
                ))}
              </div>
            </div>

            {/* <div className="m-2 p-3">
            {products && products.length < total && (
              <LoadingButton
                onClick={onSubmit}
                text={"Load More"}
                loading={loading}
                disabled={loading}
              />
            )}
          </div> */}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CategoryProduct;
