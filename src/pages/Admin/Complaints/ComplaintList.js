import React, { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import leftArrowIcon from "../../../assets/images/leftArrow.png";
import rightArrowIcon from "../../../assets/images/rightArrow.png";
import "../../../assets/css/complaints.css";
import { Card, CardBody, CardFooter, Container, Row, Col } from "reactstrap";
import { complaintsData } from "../../../common/data/ecommerce.js";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const StatusTag = ({ status }) => (
  <span className={`status-tag ${status.toLowerCase().replace(" ", "-")}`}>
    {status}
  </span>
);

const ComplaintList = () => {
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const breadcrumbItems = [
    { title: "Complaints", link: "/" },
    { title: "Lists", link: "#" },
  ];

  const filterTags = [
    { id: "All", label: "All" },
    { id: "Open", label: "Open" },
    { id: "In Progress", label: "In Progress" },
    { id: "On Hold", label: "On Hold" },
    { id: "Re-Open", label: "Re-Open" },
    { id: "Cancelled", label: "Cancelled" },
    { id: "Closed", label: "Closed" },
    { id: "Escalated", label: "Escalated" },
  ];

  const filteredComplaints = useMemo(() => {
    return complaintsData.filter((complaint) => {
      const matchesFilter = filter === "All" || complaint.status === filter;
      const matchesSearch =
        searchTerm === "" ||
        Object.values(complaint).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
          <Breadcrumbs title="Complaints List" breadcrumbItems={breadcrumbItems} />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="product-list-container">
                    <div className="product-list-header">
                      <div className="header-actions">
                        <Col className="search-container">
                          <input
                            type="text"
                            placeholder="Search..."
                            className="search-input"
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Search className="search-icon" size={20} />
                        </Col>
                        <button className="add-product-btn">
                          <span>Add Complaint</span>
                          <Plus size={20} />
                        </button>
                      </div>
                      <div className="filter-container">
                        {filterTags.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => setFilter(tag.id)}
                            className={`filter-button ${tag.id.toLowerCase().replace(" ", "-")} ${filter === tag.id ? "active" : ""}`}
                          >
                            {tag.label}{" "}
                            {tag.id !== "All" && `(${complaintsData.filter((c) => c.status === tag.id).length})`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="table-container product-table">
                      <table>
                        <thead className="product-lists-data">
                          <tr>
                            <th className="start-border">ID</th>
                            <th>Serial Number</th>
                            <th>Status</th>
                            <th>Staff</th>
                            <th>Summary</th>
                            <th>Logged By</th>
                            <th>Logged At</th>
                            <th>Duration/TAT</th>
                            <th className="end-border">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {paginatedComplaints.length > 0 ? (
                            paginatedComplaints.map((complaint) => (
                              <tr key={complaint.id} className="row-underline">
                                <td>{complaint.id}</td>
                                <td>{complaint.serialNumber}</td>
                                <td>
                                  <StatusTag status={complaint.status} />
                                </td>
                                <td className={`staff-status ${complaint.staff === "Not Assigned" ? "not-assigned" : "assigned"}`}>
                                  {complaint.staff}
                                </td>
                                <td>{complaint.summary}</td>
                                <td>{complaint.loggedBy}</td>
                                <td>{complaint.loggedAt}</td>
                                <td>{complaint.durationTAT}</td>
                                <td className="text-center">
                                  <ul>
                                    <li>
                                      <button className="action-button edit-button">
                                        <i className="ph-bold ph-pencil-simple"></i>
                                      </button>
                                    </li>
                                    <li>
                                      <button className="action-button delete-button">
                                        <i className="ph-bold ph-trash"></i>
                                      </button>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="9" style={{ textAlign: "center" }}>
                                No complaints found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="table-card-footer">
                  <div className="pagination">
                    <p>
                      Showing {paginatedComplaints.length} of {filteredComplaints.length} entries
                    </p>
                    <div className="pagination-controls">
                      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        <img src={leftArrowIcon} alt="previous" />
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={currentPage === index + 1 ? "active" : ""}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        <img src={rightArrowIcon} alt="next" />
                      </button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ComplaintList;
