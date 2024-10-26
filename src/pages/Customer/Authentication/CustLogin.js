import React, { Component } from 'react';
import { Row, Col, Container } from "reactstrap";
import { connect } from 'react-redux';
import withRouter from '../../../components/Common/withRouter';
import { get, post } from '../../../helpers/api_helper.js';

// actions
import { checkLogin, apiError } from '../../../store/actions';

// import images
import logodark from "../../../assets/images/logo-dark.png";

class CustLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            errorMessage: '',
            otpSent: false,
            otp: ['', '', '', ''],
            otpError: '',
            countdown: 60,
        };
        this.otpRefs = Array(4).fill(null).map(() => React.createRef());
        this.timer = null;
    }

    validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phoneNumber);
    }

    handleOtpChange = (e, index) => {
        const otpValue = e.target.value;

        if (otpValue.length > 1) return;

        const otp = [...this.state.otp];
        otp[index] = otpValue;

        this.setState({ otp });

        // Move to next input if current is filled
        if (otpValue !== '' && index < 3) {
            this.otpRefs[index + 1].current.focus();
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { phoneNumber } = this.state;

        if (!this.validatePhoneNumber(phoneNumber)) {
            this.setState({ errorMessage: 'Please enter a valid phone number.' });
        } else {
            this.setState({ errorMessage: '' });
            try {
                const response = await post(`/auth/send-otp`, { phone_number: phoneNumber });
                console.log("API Response:", response.data.otp); // Log response for debugging

                if (response.status_code === 200) {
                    this.setState({ otpSent: true });
                    this.startCountdown();
                } else {
                    this.setState({ errorMessage: response.message || 'Failed to send OTP' });
                }
            } catch (error) {
                console.error("Error sending OTP:", error);
                this.setState({ errorMessage: 'An error occurred while sending OTP. Please try again.' });
            }
        }
    }

    handleOtpSubmit = async (e) => {
        e.preventDefault();
        const { otp, phoneNumber } = this.state;

        const otpString = otp.join(''); // Combine OTP digits into a string

        try {
            const response = await post(`/auth/verify-otp`, {
                phone_number: phoneNumber,
                otp: otpString
            });
            if (response.status_code === 200 || response.status_code === 201) {
                if(response.message === "Mobile Number verified successfully, Please Register first."){
                    localStorage.setItem("phoneNumber", phoneNumber);
                    this.props.router.navigate(`/auth/register`);
                } else if(response.message === "User is not verified"){
                    this.props.router.navigate(`/auth/register`);
                }else{
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
                
                    console.log('Login successful:', response);
                    
                    // Navigate to dashboard after login
                    this.props.router.navigate("/auth/dashboard");
                }
            } else {
                this.setState({ otpError: response.message || 'Invalid OTP. Please try again.' });
            }
        } catch (error) {
            if (error.response.data.message === "User is not verified") {
                this.props.router.navigate(`/auth/email-verification`);
            }
            this.setState({ otpError: 'An error occurred while verifying OTP. Please try again.' });
        }
    }

    renderOtpInputs = () => {
        console.log("Rendering OTP inputs");

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
    }

    startCountdown = () => {
        this.setState({ countdown: 60 });
        this.timer = setInterval(() => {
            this.setState((prevState) => ({
                countdown: prevState.countdown - 1,
            }), () => {
                if (this.state.countdown <= 0) {
                    clearInterval(this.timer);
                }
            });
        }, 1000);
    }

    handleResendOtp = async () => {
        this.setState({ otpSent: true });
        this.startCountdown();
        // Resend OTP logic (API call)
        try {
            const response = await get(`/auth/send-otp?phone=${this.state.phoneNumber}`);
            if (!response.status_code === 200) {
                this.setState({ errorMessage: response.message || 'Failed to resend OTP' });
            }
        } catch (error) {
            this.setState({ errorMessage: 'An error occurred while resending OTP. Please try again.' });
            console.error("Error resending OTP:", error.response ? error.response.data : error);
        }
    }

    maskPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length === 10) {
            return `${phoneNumber.slice(0, 2)}XXXXXX${phoneNumber.slice(-2)}`;
        }
        return phoneNumber;
    }

    render() {
        const { phoneNumber, errorMessage, otpSent, otpError, countdown } = this.state;

        return (
            <React.Fragment>
                <section className='log-in-section section-b-space'>
                    <a href="" className="logo-login">
                        <img src={logodark} className="img-fluid" alt="Logo" />
                    </a>

                    <Container className="w-100">
                        <Row className="g-row">
                            <Col xl={5} lg={6} className='me-auto'>
                                <div className="log-in-box">
                                    <div className="log-in-title">
                                        <h3>Welcome To AfterSales !</h3>
                                        <h5>Log In To Your Account</h5>
                                    </div>

                                    <div className="input-box">
                                        {!otpSent ? (
                                            <form onSubmit={this.handleSubmit} className='g-4' style={{ marginTop: "5%" }}>
                                                <Row className="g-row" style={{ gap: "1.5rem" }}>
                                                    <Col lg={12}>
                                                        <div className="form-floating theme-form-floating log-in-form">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="phone_number"
                                                                id="number"
                                                                placeholder="Enter your phone number"
                                                                autoComplete="off"
                                                                value={phoneNumber}
                                                                onChange={(e) => this.setState({ phoneNumber: e.target.value })}
                                                            />
                                                            <label htmlFor="number">Phone No</label>

                                                            {errorMessage && (
                                                                <p style={{ color: 'red' }}>{errorMessage}</p>
                                                            )}
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <button className="btn btn-animation w-100 justify-content-center" type="submit">Send OTP</button>
                                                    </Col>
                                                </Row>
                                            </form>
                                        ) : (
                                            <form onSubmit={this.handleOtpSubmit} className='g-4' style={{ marginTop: "5%" }}>
                                                <Row className="g-row" style={{ gap: "1.5rem" }}>
                                                    <Col lg={12}>
                                                        <div className="otp-container">
                                                            {this.renderOtpInputs()}
                                                        </div>

                                                        {otpError && (
                                                            <p style={{ color: 'red' }}>{otpError}</p>
                                                        )}
                                                    </Col>

                                                    <Col lg={12}>
                                                        <p className="otp-info">
                                                            We have sent an OTP to the number {this.maskPhoneNumber(phoneNumber)}.
                                                        </p>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="countdown" style={{ color: countdown > 0 ? 'green' : 'inherit' }}>
                                                                {countdown > 0 ? `00:${countdown < 10 ? `0${countdown}` : countdown}` : '' }
                                                            </span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-link p-0"
                                                                onClick={this.handleResendOtp}
                                                                disabled={countdown > 0}
                                                            >
                                                                Resend OTP
                                                            </button>
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <button className="btn btn-animation w-100 justify-content-center" type="submit">Verify OTP</button>
                                                    </Col>
                                                </Row>
                                            </form>
                                        )}

                                    <Col lg={12} className='my-2'>
                                        <div class="other-log-in">
                                            <h6>or</h6>
                                        </div>
                                    </Col>

                                    <Col lg={12} className='my-2'>
                                        <a href='/auth/login' className="btn btn-animation anchor-button w-100 justify-content-center" >
                                            Log In using Password
                                        </a>
                                    </Col>
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

const mapStatetoProps = state => {
    const { loginError } = state.Login;
    return { loginError };
}

export default withRouter(connect(mapStatetoProps, { checkLogin, apiError })(CustLogin));
