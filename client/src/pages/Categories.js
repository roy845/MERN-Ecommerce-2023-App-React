import Layout from "../components/Layout";
import useCategory from "../hooks/useCategory";
import LoadingSpinner from "../components/LoadingSpinner";
import FancyBox from "../components/FancyBox";
const Categories = () => {
  const [categories, loading] = useCategory();

  return (
    <Layout title={"All Categories"}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container">
          <h1 className="text-center mt-4 mb-4">All Categories</h1>
          <hr />
          <div className="row">
            {categories.map((category) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                key={category._id}
              >
                <FancyBox to={`/category/${category.slug}`}>
                  {category.name}
                </FancyBox>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Categories;
