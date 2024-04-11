import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
  accordionSummaryClasses,
} from "@mui/material";
import SearchComponent from "../../components/Search";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const addAdmin = () => {
    navigate("/create-admin");
  };

  const userData = async () => {
    try {
      axios
        .get(`http://localhost:8080/api/users/?search=${search}`)
        .then((user) => setAdminUsers(user.data))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    userData();
  }, [search]);
  const handleSearch = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    if (newSearch === "") {
      window.location.reload();
    }
  };

  const admins = adminUsers.filter((u) => u.userType === "admin");

  return (
    <>
      <div>
        <div>
          <div className="d-flex justify-content-between mt-3">
            <div className="d-flex flex-column">
              <h1>Admin Users</h1>
              <div className="d-flex gap-2">
                {/* <Button
                  sx={{
                    color: "black",
                    outline: "black",
                    border: "1px solid black",
                  }}
                >
                  Filter
                </Button> */}
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <SearchComponent
                onChange={handleSearch}
                // onClick={searchUser}
                label={"Search User"}
              />
              <Button
                onClick={addAdmin}
                sx={{
                  color: "black",
                  outline: "black",
                  border: "1px solid black",
                }}
              >
                Add Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Date Registered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins?.map((u) => {
              return (
                <TableRow key={u._id}>
                  <TableCell>{u.first_name}</TableCell>
                  <TableCell>{u.last_name}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{format(u.dob, "MMMM d, yyyy")}</TableCell>
                  <TableCell>{format(u.createdAt, "MMMM d, yyyy")}</TableCell>
                  {/* <TableCell>
                    <Link to={`/update-admin-user/${u._id}`}>
                      <EditIcon fontSize="small" />
                    </Link>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AdminUsers;
