import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { listOrders } from "../actions/orderActions";
import Loader from "./Loader";
import Message from "./Message";

const LendingDetailsComponent = ({ id, history }) => {
  const dispatch = useDispatch();

  var orderList = useSelector((state) => state.orderList);
  var { loading, error, orders } = orderList;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch, history, id]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {orders.map((order) => (
            <div key={order._id}>
              {id === order.user._id ? (
                <h3>
                  {order.orderItems.map((o) => (
                    <h6>{o.name}</h6>
                  ))}
                </h3>
              ) : (
                <h6>No Order Placed</h6>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default LendingDetailsComponent;
