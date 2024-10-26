// import React, { useState, useEffect, useMemo } from "react";
// import { Search, Plus } from "lucide-react";
// import { Link } from "react-router-dom";
// import Breadcrumbs from "../../../components/Common/Breadcrumb.js";
// import { Card, CardBody, CardFooter, Container } from "reactstrap";
// import previewIcon from "../../../assets/images/product/previewIcon.svg";
// import { WarrantyList } from "../../../helpers/url_helper.js";
// import { get } from "../../../helpers/api_helper.js";
// import leftArrowIcon from "../../../assets/images/leftArrow.png"
// import rightArrowIcon from "../../../assets/images/rightArrow.png"


// const AllWarrantyList = () => {
//   const [warrantyData, setWarrantyData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 10;

//   useEffect(() => {
//     const fetchWarranties = async () => {
//       try {
//         const response = await get(WarrantyList);
//         setWarrantyData(response.data);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWarranties();
//   }, []);

//   const breadcrumbItems = [
//     { title: "Warranty", link: "/" },
//     { title: "All Warranty", link: "#" },
//   ];

//   const filteredData = useMemo(() => {
//     return warrantyData.filter((product) =>
//       Object.values(product)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//   }, [searchTerm, warrantyData]);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Calculate total pages
//   const totalPages = Math.ceil(filteredData.length / productsPerPage);

//   // Get current products for the page
//   const currentProducts = filteredData.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="Warranty Lists" breadcrumbItems={breadcrumbItems} />
//           <Card>
//             <CardBody>
//               <div className="product-list-container">
//                 <div className="product-list-header">
//                   <div className="header-actions">
//                     <div className="search-container">
//                       <input
//                         type="text"
//                         placeholder="Search"
//                         className="search-input"
//                         value={searchTerm}
//                         onChange={handleSearch}
//                       />
//                       <Search className="search-icon" size={20} />
//                     </div>
//                     <Link to="/warranty/add-warranty">
//                       <button className="add-product-btn">
//                         <span>Add Product</span>
//                         <Plus size={20} />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>

//                 <div className="table-container product-table">
//                   {loading ? (
//                     <p>Loading warranties...</p>
//                   ) : error ? (
//                     <p>Error fetching warranties: {error.message}</p>
//                   ) : (
//                     <table>
//                       <thead className="product-lists-data">
//                         <tr>
//                           <th className="start-border">ID</th>
//                           <th>Customer Name</th>
//                           <th>Product Name</th>
//                           <th>Serial No.</th>
//                           <th>Purchased Date</th>
//                           <th>Warranty Status</th>
//                           <th>Warranty Period</th>
//                           <th>Attachment</th>
//                           <th className="end-border">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentProducts.length > 0 ? (
//                           currentProducts.map((item, index) => (
//                             <tr key={item.warranty.id} className="row-underline">
//                               <td>{item.warranty.id}</td>
//                               <td>{item.warranty.customer_id}</td>
//                               <td>{item.product.name}</td>
//                               <td>{item.product.serial_no}</td>
//                               <td>{item.warranty.product_purchased_date}</td>
//                               <td>
//                                 <span
//                                   className={`warranty-badge ${item.warranty.warranty_status ? "active" : "expired"}`}
//                                 >
//                                     {item.warranty.warranty_status ? "Active" : "Expired"}
//                                 </span>
//                               </td>
//                               <td>{item.warranty.warranty_period}</td>
//                               <td>
//                                 {item.warranty.attachment ? (
//                                   <a href={item.warranty.attachment} target="_blank" rel="noopener noreferrer">
//                                     <img src={previewIcon} alt="preview" className="warranty-preview-icon" />
//                                   </a>
//                                 ) : (
//                                   "No Attachment"
//                                 )}
//                               </td>
//                               <td>
//                                 <ul>
//                                   <li>
//                                     <a href={`/product/detail/${item.warranty.id}`} title="Edit">
//                                       <i className="ph-bold ph-pencil-simple"></i>
//                                     </a>
//                                   </li>
//                                   <li>
//                                     <a href={`/product/delete/${item.warranty.id}`} style={{ color: "#CF142B" }} data-bs-toggle="modal" data-bs-target="#exampleModalToggle" title="Delete">
//                                       <i className="ph-bold ph-trash"></i>
//                                     </a>
//                                   </li>
//                                 </ul>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="9" style={{ textAlign: "center" }}>No warranties found</td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </div>
//             </CardBody>
//             <CardFooter className="table-card-footer">
//               <div className="pagination">
//                 <p>
//                   Showing {currentProducts.length > 0
//                     ? `${(currentPage - 1) * productsPerPage + 1} to ${Math.min(currentPage * productsPerPage, filteredData.length)}`
//                     : "0"} of {filteredData.length} entries
//                 </p>
//                 <div className="pagination-controls">
//                   <button onClick={handlePreviousPage} disabled={currentPage === 1}><img src={leftArrowIcon} alt="previous" /></button>
//                   {Array.from({ length: totalPages }, (_, index) => (
//                     <button
//                       key={index + 1}
//                       onClick={() => setCurrentPage(index + 1)}
//                       className={currentPage === index + 1 ? "active" : ""}
//                     >
//                       {index + 1}
//                     </button>
//                   ))}
//                   <button onClick={handleNextPage} disabled={currentPage === totalPages}><img src={rightArrowIcon} alt="next" /></button>
//                 </div>
//               </div>
//             </CardFooter>
//           </Card>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default AllWarrantyList;


import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, CardFooter, Container } from "reactstrap";
import previewIcon from "../../../assets/images/product/previewIcon.svg";
import { WarrantyList } from "../../../helpers/url_helper";
import { get } from "../../../helpers/api_helper";
import leftArrowIcon from "../../../assets/images/leftArrow.png";
import rightArrowIcon from "../../../assets/images/rightArrow.png";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AllWarrantyList = () => {
  const [warrantyData, setWarrantyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const response = await get(WarrantyList);
        setWarrantyData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarranties();
  }, []);

  const breadcrumbItems = [
    { title: "Warranty", link: "/" },
    { title: "All Warranty", link: "#" },
  ];

  const filteredData = useMemo(() => {
    return warrantyData.filter((product) =>
      Object.values(product)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, warrantyData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / productsPerPage);

  // Get current products for the page
  const currentProducts = filteredData.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const gridOptions = {
    rowHeight: 70,
    headerHeight: 60,
    suppressRowHoverHighlight: false,
    columnHoverHighlight: false,
    domLayout: 'autoHeight'
  };

  const columnDefs = useMemo(
    () => [
      { 
        headerName: "ID", 
        field: "warranty.id",
        minWidth: 80
      },
      { 
        headerName: "Customer Name",
        field: "warranty.customer_id",
        minWidth: 150
      },
      { 
        headerName: "Product Name",
        field: "product.name",
        minWidth: 150
      },
      { 
        headerName: "Serial No.",
        field: "product.serial_no",
        minWidth: 150
      },
      { 
        headerName: "Purchased Date",
        field: "warranty.product_purchased_date",
        minWidth: 150
      },
      {
        headerName: "Warranty Status",
        field: "warranty.warranty_status",
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
        minWidth: 150
      },
      { 
        headerName: "Warranty Period",
        field: "warranty.warranty_period",
        minWidth: 150
      },
      {
        headerName: "Attachment",
        field: "warranty.attachment",
        cellRenderer: (params) => (
          params.value ? (
            <a href={params.value} target="_blank" rel="noopener noreferrer">
              <img src={previewIcon} alt="preview" className="warranty-preview-icon" />
            </a>
          ) : (
            "No Attachment"
          )
        ),
        minWidth: 120
      },
      {
        headerName: "Actions",
        field: "warranty.id",
        cellRenderer: (params) => (
          <div className="actions-btn">
            <a href={`/product/detail/${params.value}`} title="Edit">
              <i className="ph-bold ph-pencil-simple"></i>
            </a>
            <a 
              href={`/product/delete/${params.value}`} 
              style={{ color: "#CF142B" }} 
              data-bs-toggle="modal" 
              data-bs-target="#exampleModalToggle" 
              title="Delete"
            >
              <i className="ph-bold ph-trash"></i>
            </a>
          </div>
        ),
        minWidth: 120
      }
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      editable: false,
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

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
                    <div className="search-container">
                      <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <Search className="search-icon" size={20} />
                    </div>
                    <Link to="/warranty/add-warranty">
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
                    <p>Loading warranties...</p>
                  ) : error ? (
                    <p>Error fetching warranties: {error.message}</p>
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
                  Showing {currentProducts.length > 0
                    ? `${(currentPage - 1) * productsPerPage + 1} to ${Math.min(
                        currentPage * productsPerPage,
                        filteredData.length
                      )}`
                    : "0"} of {filteredData.length} entries
                </p>
                <div className="pagination-controls">
                  <button onClick={handlePreviousPage} disabled={currentPage === 1}>
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
                  <button onClick={handleNextPage} disabled={currentPage === totalPages}>
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

export default AllWarrantyList;