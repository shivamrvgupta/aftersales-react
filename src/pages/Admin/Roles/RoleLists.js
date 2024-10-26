// import React, { useState, useEffect } from "react";
// import { Search, Plus } from "lucide-react";
// import { Link } from "react-router-dom";
// import Breadcrumbs from '../../../components/Common/Breadcrumb';
// import { Card, CardBody, CardFooter, Container } from "reactstrap";
// import { get } from "../../../helpers/api_helper";
// import { RolesList } from "../../../helpers/url_helper";
// import leftArrowIcon from "../../../assets/images/leftArrow.png"
// import rightArrowIcon from "../../../assets/images/rightArrow.png"

// const AdminRolesList = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 10;

//   const breadcrumbItems = [
//     { title: "Roles", link: "/roles/all-roles" },
//     { title: "All Roles", link: "/roles/all-roles" },
//   ];

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await get(RolesList);
//         setData(response.data.roles);
//         console.log("Roles Data ---",response)
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []); 

//   // Calculate total pages
//   const totalPages = Math.ceil(data.length / productsPerPage);

//   // Get current products for the page
//   const currentRoles = data.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );

//   // Pagination controls
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs
//             title="Roles Lists"
//             breadcrumbItems={breadcrumbItems}
//           />
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
//                       />
//                       <Search className="search-icon" size={20} />
//                     </div>
//                     <Link to="/roles/add-roles">
//                       <button className="add-product-btn">
//                         <span>Add Roles</span>
//                         <Plus size={20} />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>

//                 <div className="table-container product-table">
//                 {loading ? (
//                     <p>Loading products...</p>
//                   ) : error ? (
//                     <p>Error fetching Roles: {error.message}</p>
//                   ) : (
//                     <table>
//                       <thead className="product-lists-data">
//                         <tr>
//                           <th className="start-border">ID</th>
//                           <th>Name</th>
//                           <th>Description</th>
//                           <th>Status</th>
//                           <th className="end-border">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentRoles.length > 0 ? (
//                           currentRoles.map((role, index) => (
//                             <tr
//                               key={role.id}
//                               className="row-underline"
//                             >
//                               <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
//                               <td>{role.name}</td>
//                               <td>{role.description}</td>
//                               <td>
//                                 <span
//                                   className={`warranty-badge`}
//                                 >
//                                   {role.warranty_status}
//                                 </span>
//                               </td>

//                               <td className="text-center">
//                                 <ul>
//                                     <li>
//                                         <Link to={`/roles/update-role/${role.role_id}`} data-bs-original-title="" title="">
//                                             <i class="ph-bold ph-pencil-simple"></i>
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <a href="/product/delete/65d979315ee61941d30ddbc4" style={{color : "#CF142B"}} data-bs-toggle="modal" data-bs-target="#exampleModalToggle" data-bs-original-title="" title="">
//                                             <i class="ph-bold ph-trash"></i>
//                                         </a>
//                                     </li>
//                                 </ul>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="12" style={{ textAlign: "center" }}>
//                               Nothing available
//                             </td>
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
//                   Showing {currentRoles.length > 0
//                     ? `${(currentPage - 1) * productsPerPage + 1} to ${Math.min(
//                         currentPage * productsPerPage,
//                         data.length
//                       )}`
//                     : "0"}{" "}
//                   of {data.length} entries
//                 </p>
//                 <div className="pagination-controls">
//                   <button
//                     onClick={handlePreviousPage}
//                     disabled={currentPage === 1}
//                   >
//                     <img src={leftArrowIcon} alt="previous" />
                    
//                   </button>
//                   {Array.from({ length: totalPages }, (_, index) => (
//                     <button
//                       key={index + 1}
//                       onClick={() => setCurrentPage(index + 1)}
//                       className={currentPage === index + 1 ? "active" : ""}
//                     >
//                       {index + 1}
                     
//                     </button>
//                   ))}
//                   <button
//                     onClick={handleNextPage}
//                     disabled={currentPage === totalPages}
//                   >
//                     <img src={rightArrowIcon} alt="next" />
//                   </button>
//                 </div>
//               </div>
//             </CardFooter>
//           </Card>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default AdminRolesList;

import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { Card, CardBody, CardFooter, Container } from "reactstrap";
import { get } from "../../../helpers/api_helper";
import { RolesList } from "../../../helpers/url_helper";
import leftArrowIcon from "../../../assets/images/leftArrow.png";
import rightArrowIcon from "../../../assets/images/rightArrow.png";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminRolesList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 10;

  const breadcrumbItems = [
    { title: "Roles", link: "/roles/all-roles" },
    { title: "All Roles", link: "/roles/all-roles" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get(RolesList);
        setData(response.data.roles);
        console.log("Roles Data ---", response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((role) =>
      Object.values(role)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / productsPerPage);

  // Get current roles for the page
  const currentRoles = filteredData.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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

  const gridOptions = {
    rowHeight: 60,
    headerHeight: 48,
    suppressRowHoverHighlight: false,
    columnHoverHighlight: false,
    domLayout: 'autoHeight'
  };

  const columnDefs = useMemo(
    () => [
      { 
        headerName: "ID",
        valueGetter: (params) => {
          const rowIndex = params.node.rowIndex;
          return (currentPage - 1) * productsPerPage + rowIndex + 1;
        },
        minWidth: 80
      },
      { 
        headerName: "Name",
        field: "name",
        minWidth: 150
      },
      { 
        headerName: "Description",
        field: "description",
        minWidth: 200
      },
      {
        headerName: "Status",
        field: "warranty_status",
        cellRenderer: (params) => (
          <div className="flex items-center h-full">
            <span className="warranty-badge">
              {params.value}
            </span>
          </div>
        ),
        minWidth: 120
      },
      {
        headerName: "Actions",
        field: "role_id",
        cellRenderer: (params) => (
          <div className="text-center">
            <ul>
              <li>
                <Link to={`/roles/update-role/${params.value}`} title="Edit">
                  <i className="ph-bold ph-pencil-simple"></i>
                </Link>
              </li>
              <li>
                <a 
                  href="/product/delete/65d979315ee61941d30ddbc4"
                  style={{ color: "#CF142B" }}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalToggle"
                  title="Delete"
                >
                  <i className="ph-bold ph-trash"></i>
                </a>
              </li>
            </ul>
          </div>
        ),
        minWidth: 120
      }
    ],
    [currentPage, productsPerPage]
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
          <Breadcrumbs
            title="Roles Lists"
            breadcrumbItems={breadcrumbItems}
          />
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
                    <Link to="/roles/add-roles">
                      <button className="add-product-btn">
                        <span>Add Roles</span>
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
                    <p>Error fetching Roles: {error.message}</p>
                  ) : (
                    <AgGridReact
                      className="custom-grid"
                      rowData={currentRoles}
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
                  Showing {currentRoles.length > 0
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

export default AdminRolesList;