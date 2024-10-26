import React, { useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardBody, Container } from "reactstrap";
import { post } from "../../../helpers/api_helper";
import { toast, ToastContainer } from "react-toastify";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddRoles = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: "Roles", link: "/roles/all-roles" },
    { title: "Add Roles", link: "#" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const roleData = { name, description };
    setLoading(true); 
    setFormVisible(false);

    try {
      const response = await post("/roles/all-roles", roleData);

      if (response.status_code === 200 || response.status_code === 201) {
        setTimeout(() => {
          setLoading(false);
          toast(
            <div className="custom-toast-content">
              <Check size={24} />
              <div>
                <h2>Success</h2>
                <p>Role added successfully!</p>
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
            navigate("/admin/roles/all-roles"); 
          }, 5000); 

          setTimeout(() => {
            setFormVisible(true);
            setName("");
            setDescription("");
          }, 5000);
        }, 2000);
      } else {
        throw new Error("Failed to add role");
      }
    } catch (error) {
      setLoading(false); 
      setFormVisible(true);
      toast.error(error.response ? error.response.data.message : "Failed to add role");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Add Roles" breadcrumbItems={breadcrumbItems} className="breadcrumb-title" />
          
          {loading ? (
            <div className="spinner-container">
              <div className="loading-spinner"></div>
              <p>Processing your request...</p>
            </div>
          ) : formVisible ? (
            <Card className="Add-WarrantyForm">
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <div className="add-roles-field">
                    <div className="input-container">
                      <label htmlFor="name">Name</label>
                      <input
                        className="form-control"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-container">
                      <label htmlFor="description">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <button
                    className="btn btn-long"
                    type="submit"
                    style={{ marginTop: "2%" }}
                  >
                    Add Role
                  </button>
                </form>
              </CardBody>
            </Card>
          ) : null}
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default AddRoles;
