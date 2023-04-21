import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/AdminMenu";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { Select } from "antd";
import LoadingSpinner from "../../components/LoadingSpinner";
import DeleteProductConfirmationDialog from "./DeleteProductConfirmationDialog";

const { Option } = Select;
const GET_CATEGORY_URL = "/api/v1/category/get-category";
const GET_UPDATE_PRODUCT_URL = "/api/v1/product/get-product";
const BASE_IMAGE_URL = "/api/v1/product/product-photo/";
const UPDATE_PRODUCT_URL = "/api/v1/product/update-product/";

const UpdateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState();
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState();
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  //get single product
  const getSingleProduct = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${GET_UPDATE_PRODUCT_URL}/${params.slug}`
      );
      setIsLoading(false);
      setProduct(data.product);
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setCategory(data.product.category._id);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
    } catch (error) {
      console.log(error);
      toast.error();
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(GET_CATEGORY_URL);

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      toast.error("Something went wrong in getting category");
    }
  };

  //create product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("shipping", shipping);
      photo && productData.append("photo", photo);

      const { data } = await axios.put(
        `${UPDATE_PRODUCT_URL}${id}`,
        productData
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 404) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong in updating product");
      }
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <Layout title={"Dashboard - Update Product"}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h1>Update Product</h1>
              <div className="m-1 w-75">
                <Select
                  bordered={false}
                  placeholder="Select a category"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setCategory(value);
                  }}
                  value={category}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
                <div className="mb-3">
                  <label className="btn btn-outline-secondary col-md-12">
                    {photo ? photo.name : "Upload Photo"}
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    />
                  </label>
                </div>
                <div className="mb-3">
                  {photo ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="product-photo"
                        height={"200px"}
                        className="img-responsive"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={`${BASE_IMAGE_URL}${id}?t=${Date.now()}`}
                        alt="product-photo"
                        height={"200px"}
                        className="img-responsive"
                      />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    placeholder="write a name"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    type="text"
                    value={description}
                    placeholder="write a description"
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    value={price}
                    placeholder="write a price"
                    className="form-control"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    value={quantity}
                    placeholder="write a quantity"
                    className="form-control"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <Select
                    bordered={false}
                    placeholder="Select Shipping"
                    size="large"
                    showSearch
                    className="form-select mb-3"
                    onChange={(value) => {
                      setShipping(value);
                    }}
                    value={shipping ? "Yes" : "No"}
                  >
                    <Option value={false}>No</Option>
                    <Option value={true}>Yes</Option>
                  </Select>
                </div>
                <div className="mb-3 d-flex justify-content-between">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={handleUpdate}
                  >
                    Update Product
                  </button>

                  <button
                    className="btn btn-danger mr-2"
                    onClick={() => setOpen(true)}
                  >
                    Delete Product
                  </button>
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
            {open && (
              <DeleteProductConfirmationDialog
                open={open}
                setOpen={setOpen}
                id={id}
                product={product}
              />
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UpdateProduct;
