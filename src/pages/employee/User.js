import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import "../../style/pages/admin/UserPage.scss";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

function UsersPageEmployee() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const itemsPerPage = 10; // Number of users per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/user`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });
        const data = response.data;

        if (Array.isArray(data.users)) {
          setData(data.users); // Store user list
          setFilteredData(data.users); // Set filtered data initially to all users
          setPageCount(data.total_pages); // Store total pages
        } else {
          console.error("Users data is not an array:", data.users);
          setData([]); // Reset data if format is incorrect
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [currentPage]); // Fetch data when page changes

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1; // ReactPaginate starts at 0, adjust to start at 1
    setCurrentPage(selectedPage);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = data.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.phonenumber && user.phonenumber.includes(query))
    );
    setFilteredData(filtered); // Update filtered data
  };

  const handleUpdate = (userId) => {
    navigate(`/admin/updateUser/${userId}`); // Navigate to UpdateUser page with userId
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/user/${userId}`);
      // Cập nhật lại danh sách user sau khi xóa
      const response = await axios.get(`http://localhost:3001/api/v1/user`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      const data = response.data;
      alert("User delete successfully!");

      if (Array.isArray(data.users)) {
        setData(data.users);
        setFilteredData(data.users);
        setPageCount(data.total_pages);
      } else {
        console.error("Users data is not an array:", data.users);
        setData([]); // Reset data if format is incorrect
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="user-container">
      <h2 className="userTitle">User</h2>

      {/* Search input */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by Name or Phone Number"
          value={searchQuery}
          onChange={handleSearch}
          className="filter-input"
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(searchQuery ? filteredData : data).map((user) => (
            <tr key={user.id}>
              {" "}
              {/* Use user.id as key for uniqueness */}
              <td>
                <div className="user">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="userImg"
                    />
                  ) : (
                    <img
                      src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1715060332/user_1177568_mxilzq.png"
                      alt=""
                      width={40}
                      height={40}
                      className="userImg"
                    />
                  )}
                  {user.name}
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.phonenumber}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="update"
                  onClick={() => handleUpdate(user.id)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="Previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </div>
  );
}

export default UsersPageEmployee;
