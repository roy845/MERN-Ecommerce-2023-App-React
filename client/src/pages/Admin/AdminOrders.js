import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/AdminMenu";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/auth";
import LoadingSpinner from "../../components/LoadingSpinner";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;

const GET_ALL_ORDERS_URL = "/api/v1/auth/all-orders";
const UPDATE_ORDERS_STATUS_URL = "/api/v1/auth/order-status/";
const BASE_IMAGE_URL = "/api/v1/product/product-photo/";

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "delivered",
    "cancel",
  ]);

  const [changeStatues, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(GET_ALL_ORDERS_URL);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `${UPDATE_ORDERS_STATUS_URL}${orderId}`,
        { status: value }
      );
      getOrders();
    } catch (error) {}
  };

  return (
    <Layout title={"All Orders Data"}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>

            <div className="col-md-9">
              <h1 className="text-center">All Orders</h1>
              <hr />
              <div>
                {orders?.map((order, index) => {
                  return (
                    <div className="border shadow">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Buyer</th>
                            <th scope="col">Date</th>
                            <th scope="col">Payment</th>
                            <th scope="col">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{index + 1}</td>
                            <td>
                              <Select
                                bordered={false}
                                onChange={(value) =>
                                  handleChange(order._id, value)
                                }
                                defaultValue={order?.status}
                              >
                                {status.map((s, i) => (
                                  <Option key={i} value={s}>
                                    {s}
                                  </Option>
                                ))}
                              </Select>
                            </td>
                            <td>{order?.buyer?.name}</td>
                            <td>{moment(order?.createdAt).fromNow()}</td>
                            <td>
                              {order?.payment.success ? "Success" : "Failed"}
                            </td>
                            <td>{order?.products?.length}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="container">
                        {order?.products?.map((product, index) => (
                          <div
                            className="row mb-2 p-3 card flex-row"
                            key={product._id}
                          >
                            <div className="col-md-4">
                              <img
                                src={`${BASE_IMAGE_URL}${
                                  product._id
                                }?t=${Date.now()}`}
                                className="card-img-top"
                                alt={product.name}
                              />
                            </div>
                            <div className="col-md-8">
                              <p>{product.name}</p>
                              <p>{product.description.substring(0, 30)}</p>
                              <p>Price : {product.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminOrders;
