import React from "react";
import { Jumbotron, Container } from "react-bootstrap";

const ProductJumbotron = () => {
  return (
    <Jumbotron fluid>
      <Container className="text-center">
        <h1>Welcome to SharpNine</h1>
        <p>
          This is an effort to help people benefit from each other by selling
          their used equipments online
        </p>
      </Container>
    </Jumbotron>
  );
};

export default ProductJumbotron;
