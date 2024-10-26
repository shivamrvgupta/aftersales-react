import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

// Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

// Import Components
import MiniWidgets from "./MiniWidgets";
import RevenueAnalytics from "./RevenueAnalytics";
import SalesAnalytics from "./SalesAnalytics";

const Dashboard = () => {
  const navigate = useNavigate();
  const [breadcrumbItems] = useState([
    { title: "AfterSales", link: "/" },
    { title: "Dashboard", link: "#" },
  ]);
  const [reports, setReports] = useState([]);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [resetPassword, setResetPassword] = useState(false);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const userData = authUser?.userData;

  useEffect(() => {
    const token = localStorage.getItem("authUser");
    const user = token ? JSON.parse(token) : null;

    if (!token || !user) {
      navigate("/auth/login");
    } else {
      fetchReports();
      checkEmailVerification(user);
      checkResetPassword(user);
    }
  }, [navigate]);

  useEffect(() => {
    // Trigger warning when `isEmailVerified` changes
    if (!isEmailVerified) {
      showVerificationWarning();
    }
  }, [isEmailVerified]);

  useEffect(() => {
    // Trigger warning when `resetPassword` changes
    if (resetPassword) {
      showPasswordWarning();
    }
  }, [resetPassword]);

  const checkEmailVerification = async (user) => {
    try {
      const email = userData.email;

      // If email is not verified
      if (userData.is_email_verified === false) {
        console.log("Email is not verified:", email);
        localStorage.setItem("email", email);
        setIsEmailVerified(false); // Email is not verified, show the warning
      } else {
        setIsEmailVerified(true); // Email is verified, no warning needed
      }

    } catch (error) {
      console.error("Error checking email verification:", error);
      setIsEmailVerified(false);
    }
  };

  const checkResetPassword = (user) => {
    if (userData.reset_password === true) {
      setResetPassword(true);
    }
  };

  const showVerificationWarning = () => {
    toast.warning(
      <div className="custom-toast-content">
        <div>
          <h2>Please verify your email</h2>
          <button
            className="btn btn-primary"
            onClick={handleVerify}
            style={{ marginTop: "3%", width: "100%" }}
          >
            Verify
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const showPasswordWarning = () => {
    toast.warning(
      <div className="custom-toast-content">
        <div>
          <h2>Password reset required</h2>
          <button
            className="btn btn-primary"
            onClick={handlePasswordReset}
            style={{ marginTop: "3%", width: "100%" }}
          >
            Reset Password
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleVerify = () => {
    navigate("/auth/email-verification");
  };

  const handlePasswordReset = () => {
    navigate("/auth/reset-password");
  };

  const fetchReports = () => {
    const fetchedReports = [
      {
        icon: "ri-stack-line",
        title: "Number of Sales",
        value: "1452",
        rate: "2.4%",
        desc: "From previous period",
      },
      {
        icon: "ri-store-2-line",
        title: "Sales Revenue",
        value: "$ 38452",
        rate: "2.4%",
        desc: "From previous period",
      },
      {
        icon: "ri-briefcase-4-line",
        title: "Average Price",
        value: "$ 15.4",
        rate: "2.4%",
        desc: "From previous period",
      },
      {
        icon: "ri-briefcase-4-line",
        title: "Total Products",
        value: "356",
        rate: "1.8%",
        desc: "From previous period",
      },
    ];

    setReports(fetchedReports);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItems={breadcrumbItems} />
          <Row>
            <MiniWidgets reports={reports} />
          </Row>
          <Row>
            <Col xl={8}>
              <RevenueAnalytics />
            </Col>
            <Col xl={4}>
              <SalesAnalytics />
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Dashboard;
