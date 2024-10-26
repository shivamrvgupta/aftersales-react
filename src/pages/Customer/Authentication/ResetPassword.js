import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Alert, Button, Container, Row, Col, Label } from 'reactstrap';

const ResetPassword = ({ forgetUser, message, forgetError, loading }) => {
    const [jwtToken, setJwtToken] = useState(null);
    const [userEmail, setAuthEmail] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
            const user = JSON.parse(authUser);
            if (!user) {
                navigate('/auth/login');
            } else {
                const userData = user.userData;
                if (userData && userData.token) {
                    console.log('JWT Token:', userData.token);
                    console.log('User Email:', userData.email);
                    setJwtToken(userData.token);  // Store JWT token in state
                    setAuthEmail(userData.email);
                }
            }
        }
    }, [navigate]);

    const handleValidSubmit = (event, values) => {
        if (jwtToken) {
            // You can now use the JWT token as needed
            console.log('JWT Token:', jwtToken);
        }

        // Dispatch the forgetUser action
        forgetUser(values, navigate);
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid className="p-0">
                    <Row className="g-0">
                        <Col lg={4}>
                            <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                                <div className="w-100">
                                    <Row className="justify-content-center">
                                        <Col lg={9}>
                                            <div>
                                                <div className="text-center">
                                                    <div>
                                                        <a href="/" className="logo"><img src={logodark} height="20" alt="logo" /></a>
                                                    </div>
                                                    <h4 className="font-size-18 mt-4">Reset Password</h4>
                                                    <p className="text-muted">Reset your password to AfterSales.</p>
                                                </div>

                                                <div className="p-2 mt-5">
                                                    {forgetError && <Alert color="danger" className="mb-4">{forgetError}</Alert>}
                                                    {message && <Alert color="success" className="mb-4">{message}</Alert>}
                                                    <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
                                                        <div className="auth-form-group-custom mb-4">
                                                            <i className="ri-mail-line auti-custom-input-icon"></i>
                                                            <Label htmlFor="useremail">Email</Label>
                                                            <AvField name="useremail" value={username} onChange={(e) => setUsername(e.target.value)} type="email" validate={{ email: true, required: true }} className="form-control" id="useremail" placeholder="Enter email" />
                                                        </div>

                                                        <div className="auth-form-group-custom mb-4">
                                                            <i className="ri-mail-line auti-custom-input-icon"></i>
                                                            <Label htmlFor="password">Password</Label>
                                                            <AvField name="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="Enter Password" />
                                                        </div>

                                                        <div className="auth-form-group-custom mb-4">
                                                            <i className="ri-mail-line auti-custom-input-icon"></i>
                                                            <Label htmlFor="confirm-password">Confirm Password</Label>
                                                            <AvField name="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="form-control" id="confirm-password" placeholder="Confirm Password" />
                                                        </div>

                                                        <div className="mt-4 text-center">
                                                            <Button color="primary" className="w-md waves-effect waves-light" type="submit">{loading ? "Loading..." : "Reset"}</Button>
                                                        </div>
                                                    </AvForm>
                                                </div>

                                                <div className="mt-5 text-center">
                                                    <p>Don't have an account? <a href="/login" className="fw-medium text-primary"> Log in </a></p>
                                                    <p>© 2021 AfterSales. Crafted with <i className="mdi mdi-heart text-danger"></i> by The Yellow Strawberry</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className="authentication-bg">
                                <div className="bg-overlay"></div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

const mapStatetoProps = state => {
    const { message, forgetError, loading } = state.Forget;
    return { message, forgetError, loading };
}

export default connect(mapStatetoProps, { forgetUser })(ResetPassword);
