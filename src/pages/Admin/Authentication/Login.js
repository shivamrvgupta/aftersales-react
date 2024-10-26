import React, { Component } from 'react';
import { Row, Col, Container } from "reactstrap";
import { connect } from 'react-redux';
import withRouter from '../../../components/Common/withRouter';
import logodark from "../../../assets/images/logo-dark.png";
import { post } from '../../../helpers/api_helper';
import { Check, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
  
    try {
      const response = await post('admin/auth/login', { email, password });
      
      if (response.data && response.data.access_token) {
        // Extract access token, role, and user data from the response
        const { access_token, role, userData } = response.data;
  
        // Store all necessary data in a single object
        const authUser = {
          accessToken: access_token,
          userData,
          role:role.name,
        };
  
        // Store the entire authUser object in localStorage
        localStorage.setItem('authUser', JSON.stringify(authUser));
  
        console.log('Login successful:', response);
  
        // If successful, navigate to the dashboard
        this.props.router.navigate("/auth/dashboard");
      } else if(response.data.message === "User is not verified") {
        localStorage.setItem("email", email);
        this.props.router.navigate(`/auth/register`);
      } else {
        // If no access token is found, navigate to the register page
        this.props.router.navigate("/auth/register");
      }
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
  
      toast.error(
        <div className="custom-toast-content">
          <div>
            <h2>User not found</h2>
            <p>Redirecting to Register Page...</p> 
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: 5000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      if (error.response && error.response.status === 404) {
       
        setTimeout(() => {
          this.props.router.navigate("/auth/register");  //navigating to register page if user is not found
        }, 5000); 
      }
    }
  }
  
  
  
  

  render() {
    return (
      <React.Fragment>
        <section className="log-in-section section-b-space">
          <a href="" className="logo-login">
            <img src={logodark} className="img-fluid" alt="logo"/>
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
                    <form onSubmit={this.handleSubmit} className="g-4" style={{ marginTop: "5%" }}>
                      <Row className="g-row">
                        <Col lg={12}>
                          <div className="form-floating theme-form-floating log-in-form">
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder="Email Address"
                              value={this.state.email}
                              onChange={(e) => this.setState({ email: e.target.value })}
                              autoComplete="off"
                            />
                            <label>Email Address</label>
                          </div>
                        </Col>

                        <Col>
                          <div className="form-floating theme-form-floating log-in-form">
                            <input
                              type="password"
                              className="form-control"
                              name="password"
                              placeholder="Password"
                              value={this.state.password}
                              onChange={(e) => this.setState({ password: e.target.value })}
                              autoComplete="off"
                            />
                            <label>Password</label>
                          </div>
                        </Col>

                        <Col lg={12} style={{ marginBottom: "5%" }}>
                          <div className="forgot-box">
                            <div className="form-check ps-0 m-0 remember-box">
                              <input
                                className="checkbox_animated check-box"
                                type="checkbox"
                                id="flexCheckDefault"
                              />
                              <label className="form-check-label" htmlFor="flexCheckDefault">
                                Remember me
                              </label>
                            </div>
                            <a href="/auth/reset-password" className="forgot-password">
                              Forgot Password?
                            </a>
                          </div>
                        </Col>

                        <Col lg={12}>
                          <button className="btn btn-animation w-100 justify-content-center" type="submit">
                            Log In
                          </button>
                        </Col>
                        
                        <Col lg={12} className='my-2'>
                          <div class="other-log-in">
                              <h6>or</h6>
                          </div>
                        </Col>

                        <Col lg={12} className='my-2'>
                            <a href='/auth/login-otp' className="btn btn-animation anchor-button w-100 justify-content-center" >
                              Log In using OTP
                            </a>
                        </Col>
                      </Row>
                    </form>
                  </div>
                </div>
              </Col>
            </Row>
          </Container> 
        </section>
        <ToastContainer />
      </React.Fragment>
    );
  }
}

export default withRouter(connect(null, null)(Login));
