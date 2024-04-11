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

const DoctorUsers = () => {
  const [doctor, setDoctor] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [search, setSearch] = useState("");
  // const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  const addDoctor = () => {
    navigate("/add-doctor");
  };
  const fetchData = async () => {
    try {
      const doctor = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/doctors?offset=${offset}&limit=14&search=${search}`
      );
      const doctorsData = doctor.data;

      const fullDoctorsData = await Promise.all(
        doctorsData.map(async (d) => {
          try {
            const clinicsID = Array.isArray(d.clinics)
              ? d.clinics.map((c) => c.clinic_id).join(",")
              : d.clinics.map((c) => c.clinic_id);
            const endPoint = Array.isArray(d.clinics) ? "/clinics-id" : "";
            const clinicsData = await axios.get(
              `${process.env.REACT_APP_SERVER_URL}/api/clinics${endPoint}/${clinicsID}`
            );
            const doctorClinics = clinicsData.data;

            const specIDs = Array.isArray(d.specializations)
              ? d.specializations.map((s) => s.spe_id).join(",")
              : d.specializations.map((s) => s.spe_id);
            const specializationsEndPoint = Array.isArray(d.specializations)
              ? "/specializations-id"
              : "";
            const specializationsData = await axios.get(
              `${process.env.REACT_APP_SERVER_URL}/api/specializations/${specializationsEndPoint}/${specIDs}`
            );
            const doctorsSpecializations = specializationsData.data;

            return {
              ...d,
              doctorClinics,
              specializations: doctorsSpecializations,
            };
          } catch (error) {
            console.log(`Error fetching details for doctor ${d._id}`, error);
            return { ...d, doctorClinics: [] };
          }
        })
      );
      const sortedData = fullDoctorsData.sort((a, b) => {
        // Convert both last names to lowercase for case-insensitive comparison
        const lastNameA = a.last_name.toLowerCase();
        const lastNameB = b.last_name.toLowerCase();
        // Use localeCompare for string comparison
        return lastNameA.localeCompare(lastNameB);
      });
      if (fullDoctorsData.length > 0) {
        setDoctor((prev) => [...prev, ...sortedData]);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  useEffect(() => {
    if (hasMoreData) {
      fetchData();
    }
  }, [offset, hasMoreData]);
  console.log(doctor);

  const handleSearch = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    // setOffset(0);
    // setDoctor([]);
    if (newSearch === "") {
      window.location.reload();
      // setOffset((prev) => prev);
      // setDoctor([]);
      // setHasMoreData(true);
      // fetchData();
    }
  };

  const searchDoctor = () => {
    setOffset(0);
    setDoctor([]);
    setHasMoreData(true);
    fetchData();
  };

  useEffect(() => {
    const handleScroll = (e) => {
      const scrollHeight = e.target.documentElement.scrollHeight;
      const currentHeight =
        e.target.documentElement.scrollTop + window.innerHeight;
      if (currentHeight + 1 >= scrollHeight) {
        setOffset((prevOffset) => prevOffset + 14);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  // doctor.map((d) => console.log(d.clinics));
  // const s = doctor.map((d) => d.specializations);
  // s.map((x) => console.log(x.spe_name));

  return (
    <>
      <div>
        <div>
          <div className="d-flex justify-content-between mt-3">
            <div className="d-flex flex-column">
              <h1>Doctor Users</h1>
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
            <div className="d-flex align-items-center gap-3 ">
              <SearchComponent onChange={handleSearch} label={"Search User"} />
              <Button
                // variant="outlined"
                onClick={() => {
                  navigate("/create-doctor-user");
                }}
                sx={{
                  color: "black",
                  outline: "black",
                  border: "1px solid black",
                }}
              >
                Add User
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
            {doctor.map((d) => {
              return (
                <TableRow>
                  <TableCell> {d.first_name}</TableCell>
                  <TableCell>{d.last_name}</TableCell>
                  <TableCell>{d.username ? d.username : "undefined"}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>{format(d.dob, "MMMM d, yyyy")}</TableCell>
                  <TableCell>
                    {d.createdAt
                      ? format(d.createdAt, "MMMM d, yyyy")
                      : "undefined"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default DoctorUsers;
