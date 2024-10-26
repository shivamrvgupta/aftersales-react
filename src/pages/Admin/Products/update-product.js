import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardBody, Container } from "reactstrap";
import { Check, X } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import { get, put } from "../../../helpers/api_helper"; // Using `put` for updating and `get` for fetching

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`; // Converts to DD-MM-YYYY format for display
}

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [uniqueNumber, setUniqueNumber] = useState("");
  const [date_of_manufacture, setPurchasedDate] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [loading, setLoading] = useState(true); // Set loading to true initially

  const { product_id } = useParams(); // Get product_id from the route params
  const userData = JSON.parse(localStorage.getItem("authUser"));
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: "Products", link: "/products/all-products" },
    { title: "Update Product", link: "#" },
  ];

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await get(`/admin/product/get/${product_id}`, {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        });
        const productData = response.data;
        setName(productData.name);
        setType(productData.type);
        setModel(productData.model);
        setCapacity(productData.capacity);
        setSerialNumber(productData.serial_no);
        setUniqueNumber(productData.unique_no);
        setPurchasedDate(formatDate(productData.date_of_manufacture));
        setWarrantyPeriod(productData.warranty_period);
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to fetch product data.");
      } finally {
        setLoading(false); // Set loading to false here
      }
    };

    fetchProductData();
  }, [product_id, userData?.accessToken]); // Only re-run if product_id or accessToken changes

  const handleFormUpdate = async (e) => {
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
      date_of_manufacture: formatDate(date_of_manufacture),
    };

    setLoading(true); // Set loading to true when updating
    try {
      const response = await put(`/admin/product/update/${product_id}`, formData, {
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
            <p>{response.data.message}</p>
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

    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setLoading(false); // Ensure loading is false after the update attempt
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Update Product"
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
                    <input className="form-control" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="type">Type <span>*</span></label>
                    <input className="form-control" name="type" type="text" value={type} onChange={(e) => setType(e.target.value)} required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="model">Model <span>*</span></label>
                    <input className="form-control" name="model" type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="capacity">Capacity <span>*</span></label>
                    <input className="form-control" name="capacity" type="text" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="serial_number">Serial Number <span>*</span></label>
                    <input className="form-control" name="serial_number" type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required />
                  </div>
                  <div className="input-container">
                    <label htmlFor="unique_number">Unique Number <span>*</span></label>
                    <input className="form-control" name="unique_number" type="text" value={uniqueNumber} onChange={(e) => setUniqueNumber(e.target.value)} required />
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
                    <input className="form-control" name="warranty_period" type="text" value={warrantyPeriod} onChange={(e) => setWarrantyPeriod(e.target.value)} required />
                  </div>
                </div>
                <div className="input-container-fields" style={{ marginTop: "1%" }}>
                  <button className="btn btn-long" onClick={handleFormUpdate}>Update</button>
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

export default UpdateProduct;
