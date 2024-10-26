import React from "react";
// import rightArrow from "../../../src/assets/images/product/rightArrowIcon.svg"
import "../../../src/assets/css/products.css"

const ProductCommonComponent = (props) => {
  return (
    <div className="main-container">
      <h1 className="main-title">{props.title}</h1>
      <div className="subtitle-container">
        <h2>{props.subtitle}</h2>
        <img alt="arrowIcon"/>
        <span>{props.newtitle}</span>
      </div>
    </div>
  );
};

export default ProductCommonComponent;
