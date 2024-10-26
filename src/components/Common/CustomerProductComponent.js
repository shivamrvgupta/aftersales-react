import React from 'react';
import prodImg1 from "../../../src/assets/images/customer/prodImg1.png";
import arrowIcon from "../../../src/assets/images/customer/arrow.svg";
import demoImg from "../../assets/images/demo.png";

const CustomerProductComponent = ({ product }) => {
  // Extract the product and warranty information from the product prop
  const { product: productDetails, warranty } = product; 

  return (
    <div className='customer-sub-component-main-container'>
      <div className="img-container">
        <img src={productDetails.image || demoImg} alt="Product" className="product-image" />
      </div>
      <div className='desc-container'>
        <h1>{productDetails.name}</h1>
        <ul>
          <li className='list-items'><img src={arrowIcon} alt='arrow-icon' /> Serial Number - {productDetails.serial_no}</li>
          <li className='list-items'><img src={arrowIcon} alt='arrow-icon' /> Warranty - {warranty.warranty_status}</li>
          <li className='list-items'><img src={arrowIcon} alt='arrow-icon' /> Capacity - {productDetails.capacity}</li>
        </ul>
      </div>
     
      <div
        className={`warranty-indicator ${warranty.warranty_status === "Active" ? "active" : "expired"}`}
      ></div>
    </div>
  );
};

export default CustomerProductComponent;
