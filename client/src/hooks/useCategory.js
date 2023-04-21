import { useState, useEffect } from "react";
import axios from "axios";

const GET_CATEGORIES_URL = "/api/v1/category/get-category";

export default function useCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  //get categories
  const getCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(GET_CATEGORIES_URL);
      setLoading(false);
      setCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return [categories, loading];
}
