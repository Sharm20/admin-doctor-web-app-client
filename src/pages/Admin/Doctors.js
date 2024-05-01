import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchComponent from "../../components/Search";
import Delete from "../../components/Delete";
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
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import EditIcon from "@mui/icons-material/Edit";
import StatusIndicator from "../../components/StatusIndicator";

const Doctors = () => {
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
        `${process.env.REACT_APP_SERVER_URL}/api/doctors?offset=${offset}&limit=10&search=${search}`
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
        setOffset((prevOffset) => prevOffset + 10);
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
      <div
        className="header"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          position: "sticky",
          top: 10,
          minHeight: 0,
          zIndex: 1,
        }}
      >
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column">
            <h1>Doctors</h1>
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
              onClick={searchDoctor}
              label={"Search Doctor Name"}
            />

            <Button
              onClick={addDoctor}
              sx={{
                color: "black",
                outline: "black",
                border: "1px solid black",
              }}
            >
              Add Doctor
            </Button>
          </div>
        </div>
      </div>
      <div className="w-500 vh-500 d-flex justify-content-center align-items-center">
        <div className="w-100 h-20">
          <Table>
            <TableHead
              sx={{
                position: "sticky",
                top: 66.5,
                background: "rgba(255,255,255,0.9)",
                zIndex: 2,
              }}
            >
              <TableRow>
                <TableCell>
                  <h5>Last Name</h5>
                </TableCell>
                <TableCell>
                  <h5>First Name</h5>
                </TableCell>
                <TableCell>
                  <h5>Specializations</h5>
                </TableCell>
                <TableCell>
                  <h5>Clinics Code</h5>
                </TableCell>
                <TableCell>
                  <h5>Status</h5>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctor?.map((d) => {
                {
                  console.log(d._id);
                }
                return (
                  <TableRow key={d._id}>
                    <TableCell>{d.last_name}</TableCell>
                    <TableCell>{d.first_name}</TableCell>
                    <TableCell>
                      {d.specializations.map((specialization) => (
                        <span key={specialization._id}>
                          {specialization.specialty_name}{" "}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Accordion sx={{ width: "100px" }}>
                        <AccordionSummary sx={{ paddingLeft: "25px" }}>
                          Clinics
                        </AccordionSummary>
                        <AccordionDetails>
                          {d.doctorClinics.map((clinic) => (
                            <div key={clinic._id}>
                              {d.doctorClinics ? clinic.clinic_code : "N/A"}
                            </div>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>

                    <TableCell>
                      {d.is_active ? (
                        <StatusIndicator
                          background={"#5a9f68"}
                          status={"ACTIVE"}
                          paddingLeft={"10px"}
                        />
                      ) : (
                        <StatusIndicator
                          background={"#b23d3c"}
                          status={"INACTIVE"}
                          paddingLeft={"5px"}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Link to={`/update-doctor/${d._id}`} className="btn">
                        <EditIcon fontSize="small" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Doctors;
