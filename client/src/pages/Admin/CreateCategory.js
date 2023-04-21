import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import AdminMenu from "../../components/AdminMenu";
import CatogryTable from "./CatogryTable";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import CategoryForm from "../../components/Form/CategoryForm";

const GET_CATEGORY_URL = "/api/v1/category/get-category";
const CREATE_CATEGORY_URL = "/api/v1/category/create-category";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [visibleDeleteCategoryDialog, setVisibleDeleteCategoryDialog] =
    useState(false);

  //handle Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(CREATE_CATEGORY_URL, { name });
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        toast.error(error.response.data.message);
      } else if (error?.response?.status === 409) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong in input form");
      }
    }
    setName("");
  };

  //get all categories
  const getAllCategory = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(GET_CATEGORY_URL);

      if (data?.success) {
        setCategories(data?.category);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="w-75">
                <CatogryTable
                  categories={categories}
                  setVisible={setVisible}
                  setSelected={setSelected}
                  visible={visible}
                  selected={selected}
                  getAllCategory={getAllCategory}
                  visibleDeleteCategoryDialog={visibleDeleteCategoryDialog}
                  setVisibleDeleteCategoryDialog={
                    setVisibleDeleteCategoryDialog
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
