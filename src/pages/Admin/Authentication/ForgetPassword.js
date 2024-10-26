import React, { Component } from 'react';
import { Row, Col, Container } from "reactstrap";
import { connect } from 'react-redux';
import withRouter from '../../../components/Common/withRouter';
import logodark from "../../../assets/images/logo-dark.png";
import { post } from '../../../helpers/api_helper';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "" }; // Only email is needed for reset password
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { email } = this.state;

    try {
      // Send the forgot password request
      const response = await post('/auth/forgot-password', { email });
      console.log(response); // Handle the response, e.g., show a success message

      // Navigate or show feedback to the user
      alert("Password reset link has been sent to your email.");
      this.props.router.navigate("/login");
    } catch (error) {
      console.error("Forgot password request failed:", error.response ? error.response.data : error.message);
      alert("An error occurred. Please try again.");
    }
  }

  render() {
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
                    <h3>Reset Password!</h3>
                    <h5>Reset your password for AfterSales.</h5>
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
                            <label htmlFor="email">Email Address</label>
                          </div>
                        </Col>

                        <Col lg={12}>
                          <button className="btn btn-animation w-100 justify-content-center" type="submit">
                            Send Reset Link
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

// Connecting to Redux (if required for other purposes)
const mapStatetoProps = (state) => {
  const { loginError } = state.Login;
  return { loginError };
};

export default withRouter(connect(mapStatetoProps, { checkLogin: null, apiError: null })(ResetPassword));
