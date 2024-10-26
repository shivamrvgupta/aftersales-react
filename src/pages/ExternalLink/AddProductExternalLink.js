import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { post, get } from "../../helpers/api_helper";

function formatDate(dateString) {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`; // Converts to YYYY-MM-DD format
}

const AddProductExternalLink = () => {
  const [formData, setFormData] = useState({
    name: "",
    customerType: "",
    phoneNo: "",
    email: "",
    companyName: "",
    gstNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    serialNumber: "",
  });

  // Sample data for dropdowns
  const cities = [
    "Mumbai",
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
  ];
  const states = [
    "Maharashtra",
    "California",
    "Texas",
    "Florida",
    "New York",
    "Pennsylvania",
  ];
  const countries = [
    "India",
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
  ];

  const [serialNumber, setSerialNumber] = useState(""); // Initialize as an array
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchasedDate, setPurchasedDate] = useState("");
  const [warrantyStartDate, setWarrantyStartDate] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // For loading state
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (serialNumber === "") {
      alert("Please enter a valid serial number.");
      return;
    }

    // Call the search API using the serial number
    try {
      const response = await get(`/product/search?serial_no=${serialNumber}`);
      console.log(serialNumber);
      if (response.message === "Products found") {
        setSelectedProduct(response.data[0]); // Set the selected product based on API response
        console.log(response.data);
        setFormSubmitted(true);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to find product. Please check the serial number.", error);
    }
  };

  const handleSerialNumberChange = (e) => {
    const value = e.target.value;
    setSerialNumber(value);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Call handleSerialNumberChange only if 'name' is 'serialNumber'
    if (e.target.name === "serialNumber") {
      handleSerialNumberChange(e); // Pass event instead of value
    }
  };

  const handleCustomerTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      customerType: value,
      companyName: value === "individual" ? "" : prevState.companyName,
      gstNo: value === "individual" ? "" : prevState.gstNo,
    }));
  };

  const handlePurchasedDateChange = (e) => {
    const date = e.target.value;
    setPurchasedDate(date);

    if (selectedProduct) {
      setWarrantyStartDate(date);

      const warrantyPeriod = selectedProduct.warranty_period.toLowerCase(); // Example: "1 year 6 months 5 days"
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

    // Add form data to FormData object
    const userData = {
      name: formData.name,
      customer_type: formData.customerType,
      phone_number: formData.phoneNo,
      email: formData.email,
      company_name: formData.companyName,
      gst_number: formData.gstNo,
    };

    const addressData = {
      address_1: formData.addressLine1,
      address_2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pincode: formData.pincode,
    };

    const productData = {
      product_id: serialNumber,
      product_purchased_date: formatDate(purchasedDate),
      warranty_end_date: formatDate(warrantyEndDate),
      warranty_start_date: formatDate(warrantyStartDate),
      warranty_status: true,
      attachment: file ? file.name : "",
    };

    const responseData = {
      user: userData,
      address: addressData,
      product: productData,
    };
    // Append file if it exists
    try {
      console.log("Form data to be sent:", responseData);

      const response = await post("/general/register-warranty", responseData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser?.accessToken}`,
        },
      });

      console.log("Sale added successfully:", response);

      if (response.status === 200) {
        alert("Sale added successfully");
      }
    } catch (error) {
      console.error("Error adding sale:", error);
      // Handle error (e.g., show error message)
    }
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
          .form-floating > .form-control:focus ~ label::after, .form-floating > .form-control:not(:placeholder-shown) ~ label::after, .form-floating > .form-control-plaintext ~ label::after, .form-floating > .form-select ~ label::after {
            background-color: #ffffff !important;
          }
            
        `}
      </style>
      <section className="add-product-section section-b-space">
        <div className="w-100 h-100" style={{ padding: "2rem 1rem" }}>
          <div className="add-product-title-external">
            <h3>Add Product</h3>
          </div>
          <Row className="g-3">
            <Col
              xl={7}
              lg={7}
              md={6}
              sm={12}
              className="d-flex align-items-stretch"
            >
              <div
                className="add-product-box w-100 equal-height"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div className="input-box flex-grow-1">
                  <form onSubmit={handleSubmit} className="g-4">
                    <Row>
                      <Col md={12}>
                        <div className="bg-white p-4 rounded mb-4">
                          <h5 className="add-product-title-external-heading">
                            User Data
                          </h5>
                          <Row className="g-3">
                            <Col md={6} sm={12}>
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
                            <Col md={6} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <select
                                  className="form-control"
                                  name="customerType"
                                  value={formData.customerType}
                                  onChange={handleCustomerTypeChange}
                                >
                                  <option value="">Select customer type</option>
                                  <option value="individual">Individual</option>
                                  <option value="business">Business</option>
                                </select>
                                <label>Customer Type</label>
                              </div>
                            </Col>
                            <Col md={6} sm={12}>
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
                            <Col md={6} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder="Enter email address"
                                />
                                <label>Email</label>
                              </div>
                            </Col>
                            <Col md={6} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="companyName"
                                  value={formData.companyName}
                                  onChange={handleInputChange}
                                  placeholder="Enter company name"
                                  disabled={
                                    formData.customerType === "individual"
                                  }
                                />
                                <label>Company Name</label>
                              </div>
                            </Col>
                            <Col md={6} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="gstNo"
                                  value={formData.gstNo}
                                  onChange={handleInputChange}
                                  placeholder="Enter GST number"
                                  disabled={
                                    formData.customerType === "individual"
                                  }
                                />
                                <label>GST No.</label>
                              </div>
                            </Col>
                            <Col lg={12} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="addressLine1"
                                  value={formData.addressLine1}
                                  onChange={handleInputChange}
                                  placeholder="Address line 1"
                                />
                                <label>Address</label>
                              </div>
                            </Col>
                            <Col lg={12} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="addressLine2"
                                  value={formData.addressLine2}
                                  onChange={handleInputChange}
                                  placeholder="Address line 2"
                                />
                                <label>Address Line 2</label>
                              </div>
                            </Col>
                            <Col md={6} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <select
                                  className="form-control"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                >
                                  <option value="">Select city</option>
                                  {cities.map((city, index) => (
                                    <option key={index} value={city}>
                                      {city}
                                    </option>
                                  ))}
                                </select>
                                <label>City</label>
                              </div>
                            </Col>
                            <Col md={6} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <select
                                  className="form-control"
                                  name="state"
                                  value={formData.state}
                                  onChange={handleInputChange}
                                >
                                  <option value="">Select state</option>
                                  {states.map((state, index) => (
                                    <option key={index} value={state}>
                                      {state}
                                    </option>
                                  ))}
                                </select>
                                <label>State</label>
                              </div>
                            </Col>
                            <Col md={6} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <select
                                  className="form-control"
                                  name="country"
                                  value={formData.country}
                                  onChange={handleInputChange}
                                >
                                  <option value="">Select country</option>
                                  {countries.map((country, index) => (
                                    <option key={index} value={country}>
                                      {country}
                                    </option>
                                  ))}
                                </select>
                                <label>Country</label>
                              </div>
                            </Col>
                            <Col md={6} sm={12}>
                              <div className="form-floating theme-form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="pincode"
                                  value={formData.pincode}
                                  onChange={handleInputChange}
                                  placeholder="Enter pincode"
                                />
                                <label>Pincode</label>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </div>
              </div>
            </Col>
            <Col
              xl={5}
              lg={5}
              md={6}
              sm={12}
              className="d-flex align-items-stretch"
            >
              <div
                className="bg-white p-4 rounded mb-4 w-100 equal-height"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <h5 className="add-product-title-external-heading">
                  Product Data
                </h5>
                <Row className="g-3 flex-grow-1">
                  <Col lg={12}>
                    <div className="form-floating theme-form-floating">
                      <input
                        type="text"
                        name="serialNumber"
                        className="form-control"
                        placeholder="Enter product serial number"
                        value={serialNumber}
                        onChange={handleSerialNumberChange}
                        readOnly={formSubmitted}
                      />
                      <label htmlFor="serial_no">
                        Serial Number <span>*</span>
                      </label>
                    </div>
                    {!formSubmitted && (
                      <div
                        className="input-container-fields"
                        style={{ marginTop: "1%", width: "100%" }}
                      >
                        <button
                          className="link-btn"
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
                      <Col lg={12}>
                        <div className="form-floating theme-form-floating">
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProduct.warranty_period}
                            readOnly
                          />
                          <label>Warranty Period</label>
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
                    </>
                  )}
                </Row>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!formSubmitted}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddProductExternalLink;