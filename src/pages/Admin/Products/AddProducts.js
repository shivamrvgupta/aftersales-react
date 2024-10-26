import React, { useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardBody, Container } from "reactstrap";
import { Check, X } from 'lucide-react';
import { useNavigate } from "react-router-dom"; 
import { post } from "../../../helpers/api_helper";

function formatDate(dateString) {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`; // Converts to YYYY-MM-DD format
}

const AddProduct = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [uniqueNumber, setUniqueNumber] = useState("");
  const [date_of_manufacture, setPurchasedDate] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [loading, setLoading] = useState(false); 
  const userData = JSON.parse(localStorage.getItem("authUser"));
  const userId = userData?.userData?.user_id;
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: "Products", link: "/products/all-products" },
    { title: "Add Products", link: "#" },
  ];

  const handleFormRegister = async (e) => {
    e.preventDefault();

    if (
      name === "" || type === "" || model === "" || 
      capacity === "" || serialNumber === "" || 
      uniqueNumber === "" || date_of_manufacture === "" || 
      warrantyPeriod === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    let status = warrantyPeriod > 0;

    const formData = {
      name,
      type,
      model,
      capacity,
      warranty: status,
      warranty_period: warrantyPeriod,
      serial_no: serialNumber,
      unique_no: uniqueNumber,
      date_of_manufacture : formatDate(date_of_manufacture),
    };

    setLoading(true); 
    try {
      const response = await post("/admin/product/add-product", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.accessToken}`,
        },
      });

      toast(
        <div className="custom-toast-content">
          <Check size={24} />
          <div>
            <h2>Success</h2>
            <p>{response.data.message}</p> {/* Assuming your API returns a message */}
          </div>
        </div>,
        {
          className: 'custom-toast',
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
        navigate("/products/all-products"); 
      }, 5000); 

      // Reset form fields
      setName("");
      setType("");
      setModel("");
      setCapacity("");
      setSerialNumber("");
      setUniqueNumber("");
      setPurchasedDate("");
      setWarrantyPeriod("");

    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to register product. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Add Products"
            breadcrumbItems={breadcrumbItems}
            className="breadcrumb-title"
          />

          {loading ? (
            <div className="spinner-container">
              <div className="loading-spinner"></div>
              <p>Processing your request...</p>
            </div>
          ) : (
            <Card className="Add-WarrantyForm">
              <CardBody>
                <div className="add-product-hidden-field" style={{ marginTop: "1%" }}>
                  <div className="input-container">
                    <label htmlFor="name">Name <span>*</span></label>
                    <input className="form-control" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Product Name" required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="type">Type <span>*</span></label>
                    <input className="form-control" name="type" type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Enter Product Type" required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="model">Model <span>*</span></label>
                    <input className="form-control" name="model" type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Enter Product Model" required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="capacity">Capacity <span>*</span></label>
                    <input className="form-control" name="capacity" type="text" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Enter Capacity" required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="serial_number">Serial Number <span>*</span></label>
                    <input className="form-control" name="serial_number" type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Enter Serial Number" required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="unique_number">Unique Number <span>*</span></label>
                    <input className="form-control" name="unique_number" type="text" value={uniqueNumber} onChange={(e) => setUniqueNumber(e.target.value)} placeholder="Enter Unique Number" required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="date_of_manufacture">Product Manufacturing Date <span>*</span></label>
                    <input 
                      className="form-control" 
                      name="date_of_manufacture" 
                      type="date" 
                      value={date_of_manufacture} 
                      onChange={(e) => setPurchasedDate(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="warranty_period">Warranty Period <span>*</span></label>
                    <input className="form-control" name="warranty_period" type="text" value={warrantyPeriod} onChange={(e) => setWarrantyPeriod(e.target.value)} placeholder="Enter Warranty Period (in days)" required />
                  </div>
                </div>
                <div className="input-container-fields" style={{ marginTop: "1%" }}>
                  <button className="btn btn-long" onClick={handleFormRegister}>Register</button>
                </div>
              </CardBody>
            </Card>
          )}
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default AddProduct;
