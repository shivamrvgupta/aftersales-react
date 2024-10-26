import React, { useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Container } from "reactstrap";
import { get, post } from "../../../helpers/api_helper"; // Adjust the import path as necessary
import { toast, ToastContainer } from "react-toastify";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatDate(dateString) {
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`; // Converts to YYYY-MM-DD format
}

const AddProduct = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchasedDate, setPurchasedDate] = useState("");
  const [warrantyStartDate, setWarrantyStartDate] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // For loading state
  const [formVisible, setFormVisible] = useState(true); // To manage form visibility

  const navigate = useNavigate();


  const breadcrumbItems = [
    { title: "Warranty", link: "/products/all-warranties" },
    { title: "Add Warranty", link: "#" },
  ];

  // Fetch the UserData from local storage
  const userData = JSON.parse(localStorage.getItem("authUser"));
  const userId = userData?.userData?.user_id;
  console.log("userData", userId);

  const handleSerialNumberChange = (e) => {
    const value = e.target.value;
    setSerialNumber(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (serialNumber === "") {
      alert("Please enter a valid serial number.");
      return;
    }

    // Call the search API using the serial number
    try {
      const response = await get(`/product/search?serial_no=${serialNumber}`);
      if (response.message === "Products found") {
        setSelectedProduct(response.data[0]); // Set the selected product based on API response
        console.log(response.data);
        setFormSubmitted(true);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to find product. Please check the serial number.");
    }
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
    

  const handleFormRegister = async (e) => {
    e.preventDefault();
  
    const formData = {
      product_id: serialNumber, // Assuming serialNumber contains "AC2SN1235"
      product_purchased_date: formatDate(purchasedDate), // e.g., "15-01-2023"
      warranty_start_date: formatDate(warrantyStartDate), // e.g., "15-01-2023"
      warranty_end_date: formatDate(warrantyEndDate), // e.g., "14-01-2025"
      warranty_status: true,
      attachment: file ? file.name : "", // If you want to send the file name or keep it empty if no file
    };

    // Post form data to the server 
    setLoading(true); // Set loading to true
    setFormVisible(false); // Hide the form during processing

    try {
      console.log("Form data:", formData);
      const response = await post("/warranty/add-warranty", formData, {
        headers: {
          "Content-Type": "Application/json",
          "Authorization": `Bearer ${userData?.accessToken}`,
        },
      });
  
      if (response) {
        setTimeout(() => {
          setLoading(false); // Set loading to false
          toast(
            <div className="custom-toast-content">
              <Check size={24} />
              <div>
                <h2>Success</h2>
                <p>Warranty registered successfully!</p>
              </div>
            </div>,
            {
              className: "custom-toast",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              closeButton: ({ closeToast }) => (
                <button onClick={closeToast} className="custom-close-button">
                  <X size={18} />
                </button>
              ),
            }
          );

          setTimeout(() => {
            navigate("/products/all-warranties"); 
          }, 5000); 

          // Reset the form and make it visible again
          setTimeout(() => {
            setFormVisible(true);
            setSerialNumber("");
            setPurchasedDate("");
            setWarrantyStartDate("");
            setWarrantyEndDate("");
            setFile(null);
            setSelectedProduct(null);
            setFormSubmitted(false);
          }, 5000);
        }, 2000);
      }
    } catch (error) {
      setLoading(false); // Set loading to false
      setFormVisible(true); // Show the form again
      console.error("Error registering warranty:", error);
      alert("Failed to register warranty. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Add Product Warranty"
            breadcrumbItems={breadcrumbItems}
            className="breadcrumb-title"
          />

          {loading ? (
            <div className="spinner-container">
              <div className="loading-spinner"></div>
              <p>Processing your request...</p>
            </div>
          ) : formVisible ? (
            <Card className="Add-WarrantyForm">
              <CardBody>
                <div className="serial_form">
                  <label htmlFor="serial_no">
                    Serial Number <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="product_id"
                    className="form-control"
                    placeholder="Enter product serial number"
                    value={serialNumber}
                    onChange={handleSerialNumberChange}
                    readOnly={formSubmitted} // Make it read-only if form is submitted
                  />
                </div>

                {!formSubmitted && (
                  <button className="btn btn-long" onClick={handleRegister}>
                    Search Product
                  </button>
                )}

                {formSubmitted && selectedProduct && (
                  <>
                    <div className="add-product-hidden-field" style={{ marginTop: "1%" }}>
                      <div className="input-container">
                        <label htmlFor="product_name">Product Name</label>
                        <input
                          className="form-control"
                          name="product_name"
                          type="text"
                          value={selectedProduct.name}
                          readOnly
                        />
                      </div>
                      <div className="input-container">
                        <label htmlFor="model">Model</label>
                        <input
                          className="form-control"
                          name="model"
                          type="text"
                          value={selectedProduct.model}
                          readOnly
                        />
                      </div>
                      <div className="input-container">
                        <label htmlFor="purchase_date">
                          Product Purchased Date <span>*</span>
                        </label>
                        <input
                          className="form-control"
                          name="purchase_date"
                          type="date"
                          value={purchasedDate}
                          onChange={handlePurchasedDateChange}
                          required
                        />
                      </div>
                      <div className="input-container">
                        <label htmlFor="period">Warranty Period</label>
                        <input
                          className="form-control"
                          name="period"
                          type="text"
                          value={selectedProduct.warranty_period}
                          readOnly
                        />
                      </div>
                      <div className="input-container">
                        <label htmlFor="start_date">Warranty Start Date</label>
                        <input
                          className="form-control"
                          name="start_date"
                          type="date"
                          value={warrantyStartDate}
                          readOnly
                        />
                      </div>
                      <div className="input-container">
                        <label htmlFor="end_date">Warranty End Date</label>
                        <input
                          className="form-control"
                          name="end_date"
                          type="date"
                          value={warrantyEndDate}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="input-container-fields" style={{ marginTop: "1%" }}>
                      <div className="input-container">
                        <label htmlFor="invoice">
                          Attach Invoice/Receipt <span>*</span>
                        </label>
                        <input
                          className="form-control"
                          name="invoice"
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          required
                        />
                      </div>
                      <button className="btn btn-long" onClick={handleFormRegister}>
                        Register Warranty
                      </button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          ) : null}

          <ToastContainer />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddProduct;
