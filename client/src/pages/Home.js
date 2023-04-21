import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import ProductCardUser from "../components/ProductCardUser";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import LoadingButton from "../components/LoadingButton";
import banner from "../assets/images/banner.png";

const GET_CATEGORY_URL = "/api/v1/category/get-category";
const FILTERS_URL = "/api/v1/product/product-filters";
const GET_TOTAL_COUNT_URL = "/api/v1/product/product-count";
const GET_PRODUCT_LIST_URL = "/api/v1/product/product-list/";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(GET_CATEGORY_URL);

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${GET_PRODUCT_LIST_URL}${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(GET_TOTAL_COUNT_URL);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) {
      return;
    }
    loadMore();
  }, [page]);

  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${GET_PRODUCT_LIST_URL}${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((category) => category !== id);
    }

    setChecked(all);
  };

  //get filters product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(FILTERS_URL, { checked, radio });

      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(page + 1);
  };

  return (
    <Layout title={"All Products - Best offers"}>
      <img
        src={banner}
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      <div className="row mt-3 home-page">
        <div className="col-md-2">
          <h4 className="text-center mt-5">Filter By Category</h4>
          <hr />
          <div className="d-flex flex-column">
            {categories?.map((category) => (
              <Checkbox
                key={category._id}
                onChange={(e) => handleFilter(e.target.checked, category._id)}
              >
                <h4>{category.name}</h4>
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-5">Filter By Price</h4>
          <hr />
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((price) => (
                <div key={price._id}>
                  <Radio value={price.array}>
                    <h4>{price.name}</h4>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column mt-3">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center mt-3">All Products</h1>

          <div className="d-flex flex-wrap text-center">
            {products?.map((product) => (
              <ProductCardUser key={product._id} product={product} />
            ))}
          </div>
          <div className="m-2 p-3 text-center">
            {products && products.length < total && (
              <LoadingButton
                onClick={onSubmit}
                text={"Load More"}
                loading={loading}
                disabled={loading}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
