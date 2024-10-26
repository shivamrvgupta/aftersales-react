import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, CardFooter, Container } from "reactstrap";
import { get } from "../../../helpers/api_helper";
import { ProductList } from "../../../helpers/url_helper";
import demoImg from "../../../assets/images/demo.png";
import leftArrowIcon from "../../../assets/images/leftArrow.png";
import rightArrowIcon from "../../../assets/images/rightArrow.png";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminProductList = () => {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 10;

  // Breadcrumbs
  const breadcrumbItems = [
    { title: "Products", link: "/" },
    { title: "All Products", link: "#" },
  ];

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get(ProductList);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtered data based on search
  const filteredData = useMemo(() => {
    return data.filter((product) =>
      Object.values(product)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / productsPerPage);
  const currentProducts = filteredData.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const gridOptions = {
    rowHeight: 70, // Increased row height
    headerHeight: 60, // Increased header height
    suppressRowHoverHighlight: false,
    columnHoverHighlight: false,
    domLayout: 'autoHeight'
  };

  // Define column definitions for ag-Grid
  const columnDefs = useMemo(
    () => [
      { 
        headerName: "#", 
        field: "product_id", 
        minWidth: 80,
        // cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      },
      {
        headerName: "Product Image",
        field: "image",
        cellRenderer: (params) => (
          <div className="flex items-center justify-center h-full">
            <img
              src={params.value || demoImg}
              alt="Product"
              className="object-contain"
            
            />
          </div>
        ),
        minWidth: 150,
        // cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      },
      { 
        headerName: "Product Name", 
        field: "name", 
        minWidth: 150,
        // cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      },
      { 
        headerName: "Model", 
        field: "model", 
        minWidth: 150,
        // cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      },
      { 
        headerName: "Serial Number", 
        field: "serial_no", 
        minWidth: 150,
        // cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      },
      {
        headerName: "Warranty",
        field: "warranty",
        cellRenderer: (params) => (
          <div className="flex items-center h-full">
            <span
              className={`warranty-badge ${params.value ? "active" : "expired"}`}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                backgroundColor: params.value ? '#def3d9' : '#ffe4e4',
                color: params.value ? '#2d7738' : '#d92d20'
              }}
            >
              {params.value ? "Active" : "Expired"}
            </span>
          </div>
        ),
        minWidth: 120,
        // cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      },
      {
        headerName: "Warranty Period",
        field: "warranty_period",
        minWidth: 150,
        // cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => (
          <div className="actions-btn">
            <button
              className="edit-btn"
              onClick={() => handleUpdate(params.data.product_id)}
            >
              <i className="ph-bold ph-pencil-simple"></i>
             
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(params.data.product_id)}
            >
              <i className="ph-bold ph-trash"></i>
              
            </button>
          </div>
        ),
        minWidth: 200,
        // cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      },
    ],
    []
  );

  // Event handlers for actions
  const handleUpdate = (productId) => {
    // Redirect to the update product page
    window.location.href = `/products/update-product/${productId}`;
  };

  const handleDelete = (productId) => {
    // Implement deletion logic here
    // For example, you might show a confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this product?")) {
      // Call delete API or remove from local data
      // Example: deleteProduct(productId)
      alert(`Deleted product with ID: ${productId}`);
      // Refresh the product list after deletion
      setData((prevData) =>
        prevData.filter((product) => product.product_id !== productId)
      );
    }
  };

  // Default column properties
  const defaultColDef = useMemo(
    () => ({
      editable: false,
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // Rendering
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Product Lists"
            breadcrumbItems={breadcrumbItems}
          />
          <Card>
            <CardBody>
              <div className="product-list-container" style={{height: "100%"}}>
                <div className="product-list-header">
                  <div className="header-actions">
                    <div className="search-container">
                      <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        onChange={handleSearch}
                      />
                      <Search className="search-icon" size={20} />
                    </div>
                    <Link to="/products/add-products">
                      <button className="add-product-btn">
                        <span>Add Product</span>
                        <Plus size={20} />
                      </button>
                    </Link>
                  </div>
                </div>

                <div
                  className="ag-theme-quartz" 
                  style={{ height: "500px", width: "100%" }}
                >
                  {loading ? (
                    <p>Loading products...</p>
                  ) : error ? (
                    <p>Error fetching products: {error.message}</p>
                  ) : (
                    <AgGridReact
                      className="custom-grid"
                      rowData={currentProducts}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      
                      animateRows={true}
                      gridOptions={gridOptions}
                    />
                  )}
                </div>
              </div>
            </CardBody>
            <CardFooter className="table-card-footer">
              <div className="pagination">
                <p>
                  Showing{" "}
                  {currentProducts.length > 0
                    ? `${(currentPage - 1) * productsPerPage + 1} to ${Math.min(
                        currentPage * productsPerPage,
                        filteredData.length
                      )}`
                    : "0"}{" "}
                  of {filteredData.length} entries
                </p>
                <div className="pagination-controls">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <img src={leftArrowIcon} alt="previous" />
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={currentPage === index + 1 ? "active" : ""}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <img src={rightArrowIcon} alt="next" />
                  </button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AdminProductList;
