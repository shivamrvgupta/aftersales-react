import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";
import { connect } from "react-redux";
import withRouter from "../../../components/Common/withRouter";
import logodark from "../../../assets/images/logo-dark.png";
import { post } from "../../../helpers/api_helper";
import { ToastContainer, toast } from "react-toastify";

class EmailVerification extends Component {
  constructor(props) {
    super(props);
    const email = localStorage.getItem("email"); // Fetch email from localStorage
    this.state = {
      email: email || "", // Set email from localStorage, fallback to empty if not found
      otpSent: false,
      otp: ["", "", "", ""],
      otpError: "",
      countdown: 60,
    };
    this.otpRefs = Array(4)
      .fill(null)
      .map(() => React.createRef());
    this.timer = null;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailValue = (e) => {
    const email = localStorage.getItem("email");
    this.setState({ email: e.target.value });
  };

  handleOtpChange = (e, index) => {
    const otpValue = e.target.value;

    if (otpValue.length > 1) return;

    const otp = [...this.state.otp];
    otp[index] = otpValue;

    this.setState({ otp });

    // Move to next input if current is filled
    if (otpValue !== "" && index < 3) {
      this.otpRefs[index + 1].current.focus();
    }
  };

  renderOtpInputs = () => {
    return this.state.otp.map((digit, index) => (
      <input
        key={index}
        type="text"
        className="otp-input"
        maxLength="1"
        value={digit}
        onChange={(e) => this.handleOtpChange(e, index)}
        ref={this.otpRefs[index]}
      />
    ));
  };

  startCountdown = () => {
    this.setState({ countdown: 60 });
    this.timer = setInterval(() => {
      this.setState(
        (prevState) => ({
          countdown: prevState.countdown - 1,
        }),
        () => {
          if (this.state.countdown <= 0) {
            clearInterval(this.timer);
          }
        }
      );
    }, 1000);
  };

  handleResendOtp = async () => {
    try {
      const response = await post("auth/email/resend-email-verification", {
        email: this.state.email,
      });

      if (response.status_code === 200) {
        toast.success("Verification code resent successfully!");
        this.setState({ otpSent: true });
        this.startCountdown();
      } else {
        toast.error("Failed to resend verification code.");
      }
    } catch (error) {
      console.error("Error resending verification code:", error);
      toast.error("Error resending verification code. Please try again.");
    }
  };

  async handleSubmit(event) {
    event.preventDefault();
    const { email } = this.state;

    try {
      const response = await post("auth/email/resend-email-verification", {
        email,
      });

      if (response.status_code === 200) {
        if (response.message === "User Already Verified") {
          this.props.router.navigate("/auth/dashboard");
        } else {
          toast.success("Verification code sent to your email address.");
          this.setState({ otpSent: true });
          this.startCountdown();
        }
      } else {
        toast.error("Failed to send verification email.");
      }
    } catch (error) {
      console.error(
        "Request failed:",
        error.response ? error.response.data : error.message
      );
      toast.error("Error sending verification email.");
    }
  }

  handleOtpSubmit = async (e) => {
    e.preventDefault();
    const { otp, email } = this.state;
    const otpString = otp.join("");

    try {
      const response = await post("auth/email/verify", {
        email: email,
        otp: otpString,
      });

      if (response.status_code === 200) {
        toast.success("Email verified successfully!");
        const { access_token, role, userData , user } = response.data;
          // Store auth token, userData, and role in localStorage
          // Store all necessary data in a single object


          const authUser = {
              accessToken : access_token,
              userData : userData || user,
              role:role.name,
          };

          // Store the entire authUser object in localStorage
          localStorage.setItem('authUser', JSON.stringify(authUser));
      
                    
        setTimeout(() => {
          this.props.router.navigate("/auth/dashboard");
        }, 1000);
      } else {
        this.setState({
          otpError:
            response.message || "Invalid verification code. Please try again.",
        });
        toast.error("Invalid verification code.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      this.setState({
        otpError: "An error occurred while verifying. Please try again.",
      });
      toast.error("Verification failed. Please try again.");
    }
  };

  render() {
    const { otpSent, otpError, countdown } = this.state;

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
                    <h5>Verify your Account</h5>
                  </div>

                  <div className="input-box">
                    {!otpSent ? (
                      <form
                        onSubmit={this.handleSubmit}
                        className="g-4"
                        style={{ marginTop: "5%" }}
                      >
                        <Row className="g-row">
                          <Col lg={12}>
                            <div className="form-floating theme-form-floating log-in-form">
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="Email Address"
                                value={this.state.email}
                                onChange={(e) =>
                                  this.setState({ email: e.target.value })
                                }
                                autoComplete="off"
                              />
                              <label>Email Address</label>
                            </div>
                          </Col>

                          <Col lg={12}>
                            <button
                              className="btn btn-animation w-100 justify-content-center"
                              type="submit"
                            >
                              Send Verification Code
                            </button>
                          </Col>
                        </Row>
                      </form>
                    ) : (
                      <form
                        onSubmit={this.handleOtpSubmit}
                        className="g-4"
                        style={{ marginTop: "5%" }}
                      >
                        <Row className="g-row" style={{ gap: "1.5rem" }}>
                          <Col lg={12}>
                            <div className="otp-container">
                              {this.renderOtpInputs()}
                            </div>

                            {otpError && (
                              <p style={{ color: "red" }}>{otpError}</p>
                            )}
                          </Col>

                          <Col lg={12}>
                            <p className="otp-info">
                              We have sent a verification code to{" "}
                              {this.state.email}
                            </p>
                          </Col>

                          <Col lg={12}>
                            <div className="d-flex justify-content-between align-items-center">
                              <span
                                className="countdown"
                                style={{
                                  color: countdown > 0 ? "green" : "inherit",
                                }}
                              >
                                {countdown > 0
                                  ? `00:${
                                      countdown < 10
                                        ? `0${countdown}`
                                        : countdown
                                    }`
                                  : ""}
                              </span>
                              <button
                                type="button"
                                className="btn btn-link p-0"
                                onClick={this.handleResendOtp}
                                disabled={countdown > 0}
                              >
                                Resend Code
                              </button>
                            </div>
                          </Col>

                          <Col lg={12}>
                            <button
                              className="btn btn-animation w-100 justify-content-center"
                              type="submit"
                            >
                              Verify Email
                            </button>
                          </Col>
                        </Row>
                      </form>
                    )}
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

export default withRouter(connect(null, null)(EmailVerification));
