import React from "react";
import Layout from "../../components/Layout";
import { useSearch } from "../../context/search";
import ProductCardUser from "../../components/ProductCardUser";

const Search = () => {
  const { values, setValues } = useSearch();

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((product) => (
              <ProductCardUser key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
