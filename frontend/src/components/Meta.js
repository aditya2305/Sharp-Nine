import React from "react";

import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
    </div>
  );
};

Meta.defaultProps = {
  title: "Welcome To Gsell",
  keywords: "Buy goods online , cheap products online, sell online",
  description: "Best place to buy quality assured used goods online",
};

export default Meta;
