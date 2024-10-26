import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb.js";
import { Card, CardBody, CardFooter, Container } from "reactstrap";
import { get } from "../../../helpers/api_helper";
import { CustomerWarrantyList } from "../../../helpers/url_helper";
import demoImg from "../../../assets/images/demo.png";
import previewIcon from "../../../assets/images/product/previewIcon.svg";
import leftArrowIcon from "../../../assets/images/leftArrow.png"
import rightArrowIcon from "../../../assets/images/rightArrow.png"


const CustomerProductList = () => {
  const [productsData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust items per page as needed

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get(CustomerWarrantyList);
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.warn("Unexpected API response structure:", response.data);
          setData([]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const breadcrumbItems = [
    { title: "Warranty", link: "/" },
    { title: "All Registered Warranty", link: "#" },
  ];

  // Filter products based on the selected filter
  const filteredProducts = productsData.filter((product) => {
    if (filter === "Active") return product.warranty.warranty_status === "Active";
    if (filter === "Expired") return product.warranty.warranty_status === "Expired";
    return true; // Return all if filter is "All"
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle previous and next page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Warranty Lists" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <div className="product-list-container">
                <div className="product-list-header">
                  <div className="header-actions">
                    <div className="product-tags-container">
                      <button
                        className={`product-tags ${filter === "All" ? "active" : ""}`}
                        onClick={() => {
                          setFilter("All");
                          setCurrentPage(1); // Reset to page 1 when changing filter
                        }}
                        style={{ width: "40px" }}
                      >
                        All
                      </button>
                      <button
                        className={`product-tags ${filter === "Active" ? "active" : ""}`}
                        onClick={() => {
                          setFilter("Active");
                          setCurrentPage(1); // Reset to page 1 when changing filter
                        }}
                      >
                        Active
                      </button>
                      <button
                        className={`product-tags ${filter === "Expired" ? "expired" : ""}`}
                        onClick={() => {
                          setFilter("Expired");
                          setCurrentPage(1); // Reset to page 1 when changing filter
                        }}
                      >
                        Expired
                      </button>
                    </div>
                    <Link to="/warranty/add-warranty">
                      <button className="add-product-btn">
                        <span>Add Product</span>
                        <Plus size={20} />
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="table-container product-table">
                  {loading ? (
                    <p>Loading products...</p>
                  ) : error ? (
                    <p>Error fetching products: {error.message}</p>
                  ) : (
                    <table>
                      <thead className="product-lists-data">
                        <tr>
                          <th className="start-border">Product</th>
                          <th>Product Name</th>
                          <th>Serial No.</th>
                          <th>Purchased Date</th>
                          <th>Warranty Status</th>
                          <th>Warranty Period</th>
                          <th className="end-border">Attachment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProducts.length > 0 ? (
                          paginatedProducts.map((product, index) => (
                            <tr key={product.warranty.id} className="row-underline">
                              <td>
                                <img
                                  src={product.product.image || demoImg}
                                  alt={product.product.name}
                                  className="product-image"
                                  style={{ width: "50px", height: "50px" }}
                                />
                              </td>
                              <td>{product.product.name}</td>
                              <td>{product.product.serial_no}</td>
                              <td>{product.warranty.product_purchased_date}</td>
                              <td>
                                <span
                                  className={`warranty-badge ${product.warranty.warranty_status ? "active" : "expired"}`}
                                >
                                    {product.warranty.warranty_status ? "Active" : "Expired"}
                                </span>
                              </td>
                              <td>{product.product.warranty_period}</td>
                              <td>
                                {product.product.attachment ? (
                                  <a href={product.warranty.attachment} target="_blank" rel="noopener noreferrer">
                                    <img src={previewIcon} alt="preview" className="warranty-preview-icon" />
                                  </a>
                                ) : (
                                  "No Attachment"
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>No warranties found</td>
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
                  Showing {paginatedProducts.length > 0
                    ? `${startIndex + 1} to ${startIndex + paginatedProducts.length}`
                    : "0"} of {filteredProducts.length} entries
                </p>
                <div className="pagination-controls">
                  <button onClick={handlePreviousPage} disabled={currentPage === 1}><img src={leftArrowIcon} alt="previous" /></button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={currentPage === index + 1 ? "active" : ""}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={handleNextPage} disabled={currentPage === totalPages}><img src={rightArrowIcon} alt="next" /></button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CustomerProductList;
