import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Message from "../components/Message";

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import Loader from "../components/Loader";

import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../actions/actionConstants";

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    if (!order || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, successPay, order, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  // const paymentVerificationHandler = async (data) => {
  //   await axios
  //     .post("http://localhost:5000/api/payment/paymentverification ", {
  //       data,
  //     })
  //     .then((res) => {
  //       console.log("res server - ", res);
  //       if (res.data?.success) {
  //         console.log("VERIFIED");
  //         successPaymentHandler({
  //           id: orderStatus.id,
  //           status: "completed",
  //           update_time: Date.now(),
  //           email_address: userInfo.email,
  //         });
  //         alert("Payment Completed");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Payment Failed", err);
  //     });
  // };

  const checkOutHandler = async () => {
    const {
      data: { orderStatus },
    } = await axios.post("/api/payment/checkout", {
      amount: roundToNearest100(order.totalPrice),
    });

    const {
      data: { key },
    } = await axios.get("/api/config/razorpay");

    const options = {
      key,
      amount: orderStatus.amount,
      currency: "INR",
      name: "Test",
      description: "Test Transaction",
      image: "",
      order_id: orderStatus.id,
      handler: function (response) {
        if (
          response.razorpay_order_id &&
          response.razorpay_payment_id &&
          response.razorpay_signature
        ) {
          successPaymentHandler({
            id: orderStatus.id,
            status: "completed",
            update_time: Date.now(),
            email_address: userInfo.email,
          });
        }
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: "9000090000",
      },
      notes: {
        address: "Test Address",
      },
      theme: {
        color: "#121212",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  const roundToNearest100 = (number) => {
    if (Number.isInteger(number)) {
      return number;
    } else {
      return Math.floor(number / 100) * 100;
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h1>Order {order._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong>

                    {order.user.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {order.shippingAddress.address} ,{" "}
                    {order.shippingAddress.city} ,{" "}
                    {order.shippingAddress.postalCode} ,{" "}
                    {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <Message variant="success">
                      Delivery Status : {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant="danger">
                      Delivery Status : Not Delivered
                    </Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant="success">
                      Payment Status : {order.paidAt}
                    </Message>
                  ) : (
                    <Message variant="danger">
                      Payment Status : Not Paid
                    </Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? (
                    <Message>Order is Empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              ></Image>
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x ₹{item.price} = ₹
                              {item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>₹{order.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>₹{roundToNearest100(order.totalPrice)}</Col>
                    </Row>
                  </ListGroup.Item>
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Loader />}
                      {/* {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalButton
                          amount={order.totalPrice}
                          onSuccess={successPaymentHandler}
                        />
                      )} */}
                      <Button
                        onClick={() => checkOutHandler()}
                        variant="primary"
                      >
                        Pay Now
                      </Button>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    {error && <Message variant="danger">{error}</Message>}
                  </ListGroup.Item>
                  {loadingDeliver && <Loader></Loader>}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        <Button
                          type="button"
                          className="btn btn-block"
                          onClick={deliverHandler}
                        >
                          Mark As Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default OrderScreen;
