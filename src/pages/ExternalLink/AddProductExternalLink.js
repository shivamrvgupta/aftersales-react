import React, { useState, useEffect } from "react";
import { Row, Col, Progress } from "reactstrap";
import { post, get } from "../../helpers/api_helper";
import SteppedProgress from "../../components/Common/SteppedProgress";

function formatDate(dateString) {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`; // Converts to YYYY-MM-DD format 
}

const AddProductExternalLink = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    email: "",
    serialNumber: "",
    sellerName: "",
    platform: "",
    mode: "" 
  });

  const [serialNumber, setSerialNumber] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchasedDate, setPurchasedDate] = useState("");
  const [warrantyStartDate, setWarrantyStartDate] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (serialNumber === "") {
      alert("Please enter a valid serial number.");
      return;
    }

    try {
      const response = await get(`/product/search?serial_no=${serialNumber}`);
      if (response.message === "Products found") {
        setSelectedProduct(response.data[0]);
        setFormSubmitted(true);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to find product. Please check the serial number.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "serialNumber") {
      setSerialNumber(e.target.value);
    }
  };

  const handlePurchasedDateChange = (e) => {
    const date = e.target.value;
    setPurchasedDate(date);

    if (selectedProduct) {
      setWarrantyStartDate(date);

      const warrantyPeriod = selectedProduct.warranty_period.toLowerCase();
      const endDate = new Date(date);

      const yearsMatch = warrantyPeriod.match(/(\d+)\s*years?/);
      const monthsMatch = warrantyPeriod.match(/(\d+)\s*months?/);
      const daysMatch = warrantyPeriod.match(/(\d+)\s*days?/);

      if (yearsMatch) {
        const warrantyYears = parseInt(yearsMatch[1], 10);
        endDate.setFullYear(endDate.getFullYear() + warrantyYears);
      }

      if (monthsMatch) {
        const warrantyMonths = parseInt(monthsMatch[1], 10);
        endDate.setMonth(endDate.getMonth() + warrantyMonths);
      }

      if (daysMatch) {
        const warrantyDays = parseInt(daysMatch[1], 10);
        endDate.setDate(endDate.getDate() + warrantyDays);
      }

      setWarrantyEndDate(endDate.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: formData.name,
      phone_number: formData.phoneNo,
      email: formData.email,
    };

    const productData = {
      product_id: serialNumber,
      product_purchased_date: formatDate(purchasedDate),
      warranty_end_date: formatDate(warrantyEndDate),
      warranty_start_date: formatDate(warrantyStartDate),
      warranty_status: true,
      attachment: file ? file.name : "",
    };

    const sellerData = {
      sellerName: formData.mode === "offline" ? formData.sellerName : "",
      platform: formData.mode === "online" ? formData.platform : "",
      mode: formData.mode
    };

    const responseData = {
      user: userData,
      product: productData,
      seller: sellerData,
    };

    try {
      const response = await post("/general/register-warranty", responseData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser?.accessToken}`,
        },
      });

      if (response.status === 200) {
        alert("Sale added successfully");
      }
    } catch (error) {
      alert("Error adding sale:", error);
    }
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <React.Fragment>
      <style>
        {`
           .form-floating > .form-control:focus,
           .form-floating > .form-select:focus {
             box-shadow: none;
             border-color: #ced4da;
           }
           .equal-height {
             display: flex;
             flex-direction: column;
             height: 100%;
           }
           .form-floating > .form-control:focus ~ label::after, 
           .form-floating > .form-control:not(:placeholder-shown) ~ label::after, 
           .form-floating > .form-control-plaintext ~ label::after, 
           .form-floating > .form-select ~ label::after {
            background-color: #ffffff !important;
           }
        `}
      </style>
      <section className="add-product-section section-b-space">
        <div className="w-100 h-100 external-link-add-product">
          <div className="add-product-title-external">
            <h3>Add Product</h3>
          </div>

          <SteppedProgress currentStep={currentPage} totalSteps={3} />  {/* This is for progress bar */}

          <Row className="g-3">
            {currentPage === 1 && (
              <Col lg={12}>
                <div className="bg-white p-4 rounded mb-4">
                  <h5 className="add-product-title-external-heading">
                    User Data
                  </h5>
                  <Row className="g-3">
                    <Col lg={12}>
                      <div className="form-floating theme-form-floating">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter name"
                        />
                        <label>Name</label>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form-floating theme-form-floating">
                        <input
                          type="tel"
                          className="form-control"
                          name="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                        />
                        <label>Phone No.</label>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form-floating theme-form-floating">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email"
                        />
                        <label>Email</label>
                      </div>
                    </Col>
                  </Row>
                  <button
                    onClick={goToNextPage}
                    className="next-btn mt-3"
                  >
                    Next
                  </button>
                </div>
              </Col>
            )}

            {currentPage === 2 && (
              <Col lg={12}>
                <div className="bg-white p-4 rounded mb-4">
                  <h5 className="add-product-title-external-heading">
                    Product Data
                  </h5>
                  <Row className="g-3">
                    <Col lg={12}>
                      <div className="form-floating theme-form-floating">
                        <input
                          type="text"
                          name="serialNumber"
                          className="form-control"
                          placeholder="Enter product serial number"
                          value={serialNumber}
                          onChange={handleInputChange}
                          readOnly={formSubmitted}
                        />
                        <label>Serial Number <span>*</span></label>
                      </div>
                      {!formSubmitted && (
                        <div
                          className="input-container-fields"
                          style={{ width: "100%" }}
                        >
                          <button
                            className="link-btn mt-3"
                            onClick={handleRegister}
                          >
                            Validate
                          </button>
                        </div>
                      )}
                    </Col>
                    {formSubmitted && selectedProduct && (
                      <>
                        <Col lg={12}>
                          <div className="form-floating theme-form-floating">
                            <input
                              type="text"
                              className="form-control"
                              value={selectedProduct.name}
                              readOnly
                            />
                            <label>Product Name</label>
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div className="form-floating theme-form-floating">
                            <input
                              type="text"
                              className="form-control"
                              value={selectedProduct.model}
                              readOnly
                            />
                            <label>Model</label>
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div className="form-floating theme-form-floating">
                            <input
                              type="date"
                              className="form-control"
                              value={purchasedDate}
                              onChange={handlePurchasedDateChange}
                              required
                            />
                            <label>Purchased Date</label>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="form-floating theme-form-floating">
                            <input
                              type="date"
                              className="form-control"
                              value={warrantyStartDate}
                              readOnly
                            />
                            <label>Warranty Start Date</label>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="form-floating theme-form-floating">
                            <input
                              type="date"
                              className="form-control"
                              value={warrantyEndDate}
                              readOnly
                            />
                            <label>Warranty End Date</label>
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                  <button
                    onClick={goToPreviousPage}
                    className="back-btn mt-3 me-3"
                  >
                    Back
                  </button>
                  <button
                    onClick={goToNextPage}
                    className="next-btn mt-3"
                  >
                    Next
                  </button>
                </div>
              </Col>
            )}

            {currentPage === 3 && (
              <Col lg={12}>
                <div className="bg-white p-4 rounded mb-4">
                  <h5 className="add-product-title-external-heading">
                    Seller Data
                  </h5>
                  <Row className="g-3">
                    <Col lg={12}>
                      <div className="form-floating theme-form-floating">
                        <select
                          className="form-control"
                          name="mode"
                          value={formData.mode}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Mode</option>
                          <option value="online">Online Mode</option>
                          <option value="offline">Offline Mode</option>
                        </select>
                        <label>Mode</label>
                      </div>
                    </Col>

                    {formData.mode === "offline" && (
                      <Col lg={12}>
                        <div className="form-floating theme-form-floating">
                          <input
                            type="text"
                            className="form-control"
                            name="sellerName"
                            value={formData.sellerName}
                            onChange={handleInputChange}
                            placeholder="Enter seller name"
                          />
                          <label>Seller Name</label>
                        </div>
                      </Col>
                    )}

                    {formData.mode === "online" && (
                      <Col lg={12}>
                        <div className="form-floating theme-form-floating">
                          <input
                            type="text"
                            className="form-control"
                            name="platform"
                            value={formData.platform}
                            onChange={handleInputChange}
                            placeholder="Enter platform"
                          />
                          <label>Platform</label>
                        </div>
                      </Col>
                    )}

                    <Col lg={12}>
                      <div className="form-floating theme-form-floating">
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => setFile(e.target.files[0])}
                          required
                        />
                        <label>Attach Invoice/Receipt</label>
                      </div>
                    </Col>
                  </Row>
                  <button
                    onClick={goToPreviousPage}
                    className="back-btn mt-3 me-3"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="link-submit mt-3"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddProductExternalLink;