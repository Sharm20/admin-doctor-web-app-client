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
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import EditIcon from "@mui/icons-material/Edit";
import StatusIndicator from "../../components/StatusIndicator";

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const addClinic = () => {
    navigate("/add-clinic");
  };

  const fetchData = async () => {
    try {
      const clinicResponse = await axios.get(
        `http://localhost:8080/api/clinics/?offset=${offset}&limit=20&search=${search}`
      );
      const clinicsData = clinicResponse.data;
      const clinicData = await Promise.all(
        clinicsData.map(async (c) => {
          try {
            const doctorsIds = Array.isArray(c.doctors)
              ? c.doctors.map((doc) => doc.id).join(",")
              : c.doctors.id;
            const endPoint = Array.isArray(c.doctors) ? "/doctors-id" : "";

            const doctorsData = await axios.get(
              `http://localhost:8080/api/doctors${endPoint}/${doctorsIds}`
            );
            const clinicDoctors = doctorsData.data;
            return { ...c, clinicDoctors };
          } catch (error) {
            console.log(`Error fetching details for clinic ${c._id}:`, error);
            return { ...c, clinicDoctors: [] };
          }
        })
      );
      const sortedData = clinicData.sort(function (a, b) {
        return a.floor - b.floor;
      });
      if (clinicData.length > 0) {
        setClinics((prevClinic) => [...prevClinic, ...sortedData]);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (hasMoreData) {
      fetchData();
    }
  }, [offset, hasMoreData]);

  const searchClinic = () => {
    setOffset(0);
    setClinics([]);
    setHasMoreData(true);
    fetchData();
  };

  const handleSearch = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    setOffset(0);
    // setClinics([]);
    if (newSearch === "") {
      window.location.reload();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      console.log("scroll detected");
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = window.scrollY + window.innerHeight;
      if (currentHeight + 1 >= scrollHeight) {
        setOffset((prevOffset) => prevOffset + 20);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

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
        <div>
          <div className="d-flex justify-content-between ">
            <div className="d-flex flex-column">
              <h1>Clinics</h1>
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
                onClick={searchClinic}
                label={"Search Clinic Code"}
              />

              <Button
                onClick={addClinic}
                sx={{
                  color: "black",
                  outline: "black",
                  border: "1px solid black",
                }}
              >
                Add Clinics
              </Button>
            </div>
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
                <TableCell sx={{ marginLeft: "20px", marginRight: "20px" }}>
                  <h5>Clinic Code</h5>
                </TableCell>
                <TableCell sx={{ marginLeft: "20px", marginRight: "20px" }}>
                  <h5>Floor </h5>
                </TableCell>
                <TableCell>
                  <h5>Room</h5>
                </TableCell>
                <TableCell>
                  <h5>Doctors</h5>
                </TableCell>
                <TableCell>
                  <h5>Status</h5>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clinics.map((clinic) => {
                return (
                  <TableRow key={clinic?._id}>
                    <TableCell>{clinic?.clinic_code}</TableCell>
                    <TableCell>
                      {clinic && clinic.floor ? clinic.floor : "undefined"}
                    </TableCell>
                    <TableCell>{clinic.room}</TableCell>
                    <TableCell>
                      <Accordion
                        className="acordion"
                        sx={{ width: "fit-content" }}
                      >
                        <AccordionSummary sx={{ paddingLeft: "35%" }}>
                          {clinic.clinicDoctors.length}{" "}
                          {clinic.clinicDoctors.length > 1
                            ? "Doctors"
                            : "Doctor"}
                          {/* {clinic.clinicDoctors.length === 0 && "No Doctor"} */}
                        </AccordionSummary>

                        <AccordionDetails sx={{ width: "250px" }}>
                          {clinic &&
                            clinic.clinicDoctors &&
                            clinic.clinicDoctors.map((doctor) => (
                              <TableRow size="small">
                                <TableCell>
                                  <div key={doctor._id}>
                                    <Link to={`/update-doctor/${doctor._id}`}>
                                      {doctor.first_name} {doctor.last_name}{" "}
                                    </Link>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {doctor.is_active ? "Active" : "Inactive"}
                                </TableCell>
                              </TableRow>
                            ))}
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                    <TableCell>
                      {clinic?.is_active ? (
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
                      <Link to={`/update-clinic/${clinic._id}`} className="btn">
                        <EditIcon fontSize="small" />
                      </Link>
                      <Delete id={clinic._id} endpoint={"clinics"} />
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

export default Clinics;
