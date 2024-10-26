import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";
import { connect } from "react-redux";
import withRouter from "../../../components/Common/withRouter";
import logodark from "../../../assets/images/logo-dark.png";
import { post } from "../../../helpers/api_helper";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerType: "",
      phoneNumber: localStorage.getItem("phoneNumber") || "",
      email: localStorage.getItem("email") || "",
      businessName: "",
      gstNumber: "",
      name: "",
    };
  }

  handleCustomerTypeChange = (e) => {
    const customerType = e.target.value;
    this.setState({ customerType });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { customerType, phoneNumber, businessName, gstNumber, name, email } = this.state;

    // Declare formData here
    let formData = { customer_type: customerType, phone_number: phoneNumber, name, email };

    if (customerType === "Business") {
        // Add business-specific fields if customerType is Business
        formData = {
            ...formData, // Spread the common fields
            company_name: businessName,
            gst_number: gstNumber,
        };
    }

    console.log("Submitting formData:", formData); // For debugging

    try {
        const response = await post("/auth/register", formData); 
        console.log("Registration success:", response);
        const { access_token, role, user } = response.data;
  
        // Store all necessary data in a single object
        const authUser = {
          accessToken : access_token,
          userData : user,
          role,
        };
    
        // Store the entire authUser object in localStorage
        localStorage.setItem('authUser', JSON.stringify(authUser));
    
        console.log('Login successful:', response);
        this.props.router.navigate("/auth/dashboard");
    } catch (error) {
        console.error("Registration failed:", error.response ? error.response.data : error.message);
    }
};


  render() {
    const { customerType, businessName, gstNumber, phoneNumber, name, email } = this.state;

    return (
      <React.Fragment>
        <section className="log-in-section section-b-space">
          <a href="" className="logo-login">
            <img src={logodark} className="img-fluid" alt="logo" />
          </a>

          <Container className="w-100">
            <Row className="g-row">
              <Col xl={5} lg={6} className="me-auto">
                <div className="log-in-box">
                  <div className="log-in-title">
                    <h3>Welcome To AfterSales!</h3>
                    <h5>Log In To Your Account</h5>
                  </div>

                  <div className="input-box">
                    <form
                      onSubmit={this.handleSubmit}
                      className="g-4"
                      style={{ marginTop: "5%" }}
                    >
                      <Row className="g-row">
                        <Col lg={12}>
                          <div className="form-floating theme-form-floating log-in-form">
                            <input
                              type="text"
                              className="form-control"
                              name="phoneNumber"
                              value={phoneNumber}
                              readOnly={customerType === "Business"} 
                              onChange={this.handleInputChange}
                              placeholder="Phone Number"
                              autoComplete="off"
                              required
                            />
                            <label>Phone Number</label>
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div className="form-floating theme-form-floating log-in-form">
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder="Email Address"
                              value={email}
                              readOnly={customerType === "Business"} 
                              onChange={this.handleInputChange}
                              autoComplete="off"
                              required
                            />
                            <label>Email Address</label>
                          </div>
                        </Col>

                        <Col lg={12}>
                          <div className="form-floating theme-form-floating log-in-form">
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={name}
                              readOnly={customerType === "Business"} 
                              onChange={this.handleInputChange}
                              placeholder="Name"
                              autoComplete="off"
                              required
                            />
                            <label>Name</label>
                          </div>
                        </Col>

                        {/* Dropdown Field */}
                        <Col lg={12}>
                          <div className="form-floating theme-form-floating log-in-form">
                            <select
                              className="form-control"
                              name="customerType"
                              value={customerType}
                              onChange={this.handleCustomerTypeChange}
                            >
                              <option value="" disabled>
                                Select your type
                              </option>
                              <option value="Individual">Individual</option>
                              <option value="Business">Business</option>
                            </select>
                            <label>Customer Type</label>
                          </div>
                        </Col>

                        {customerType === "Business" && (
                          <>
                            <Col lg={12}>
                              <div className="form-floating theme-form-floating log-in-form">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="businessName"
                                  value={businessName}
                                  onChange={this.handleInputChange}
                                  placeholder="Business Name"
                                  autoComplete="off"
                                  required
                                />
                                <label>Business Name</label>
                              </div>
                            </Col>

                            <Col lg={12}>
                              <div className="form-floating theme-form-floating log-in-form">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="gstNumber"
                                  value={gstNumber}
                                  onChange={this.handleInputChange}
                                  placeholder="GST Number"
                                  autoComplete="off"
                                  required
                                />
                                <label>GST Number</label>
                              </div>
                            </Col>
                          </>
                        )}

                        <Col lg={12}>
                          <button
                            className="btn btn-animation w-100 justify-content-center"
                            type="submit"
                            style={{ marginTop: "3%" }}
                          >
                            Sign Up
                          </button>
                        </Col>
                      </Row>
                    </form>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default withRouter(connect(null, null)(Register));
