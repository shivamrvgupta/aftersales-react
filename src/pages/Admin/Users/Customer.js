import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { Card, CardBody, CardFooter, Container } from "reactstrap";
import { get } from "../../../helpers/api_helper";
import { CustomerList } from "../../../helpers/url_helper";

const AdminRolesList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const breadcrumbItems = [
    { title: "Users", link: "/users/all-roles" },
    { title: "All Customer", link: "/roles/all-roles" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get(CustomerList);
        setData(response.data.users);
        console.log("Users Data ---", response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  // Calculate total pages
  const totalPages = Math.ceil(data.length / productsPerPage);

  // Get current products for the page
  const allCustomers = data.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Customers Lists" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <div className="product-list-container">
                <div className="product-list-header">
                  <div className="header-actions">
                    <div className="search-container">
                      <input type="text" placeholder="Search" className="search-input" />
                      <Search className="search-icon" size={20} />
                    </div>
                    <Link to="/products/add-products">
                      <button className="add-product-btn">
                        <span>Add Roles</span>
                        <Plus size={20} />
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="table-container product-table">
                  {loading ? (
                    <p>Loading products...</p>
                  ) : error ? (
                    <p>Error fetching Roles: {error.message}</p>
                  ) : (
                    <table>
                      <thead className="product-lists-data">
                        <tr>
                          <th className="start-border">ID</th>
                          <th>Name</th>
                          <th>Phone No.</th>
                          <th>Email.</th>
                          <th>Status</th>
                          <th className="end-border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allCustomers.length > 0 ? (
                          allCustomers.map((customer, index) => (
                            <tr key={customer.id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                              <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                              <td>{customer.name}</td>
                              <td>{customer.phone_number}</td>
                              <td>{customer.email || "-"}</td>
                              <td>
                                <span className={`warranty-badge ${customer.is_active ? "active" : "expired"}`}>
                                  {customer.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="text-center">
                                <ul>
                                  <li>
                                    <a href={`/product/detail/${customer.id}`} title="Edit">
                                      <i className="ph-bold ph-pencil-simple"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a href={`/product/delete/${customer.id}`} style={{ color: "#CF142B" }} data-bs-toggle="modal" data-bs-target="#exampleModalToggle" title="Delete">
                                      <i className="ph-bold ph-trash"></i>
                                    </a>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                              Nothing available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </CardBody>
            <CardFooter className="table-card-footer">
              <div className="pagination">
                <p>
                  Showing {allCustomers.length > 0
                    ? `${(currentPage - 1) * productsPerPage + 1} to ${Math.min(currentPage * productsPerPage, data.length)}`
                    : "0"}{" "}
                  of {data.length} entries
                </p>
                <div className="pagination-controls">
                  <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={currentPage === index + 1 ? "active" : ""}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AdminRolesList;
