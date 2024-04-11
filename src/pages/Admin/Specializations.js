import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchComponent from "../../components/Search";
import Delete from "../../components/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import StatusIndicator from "../../components/StatusIndicator";
import EditIcon from "@mui/icons-material/Edit";

const Specializations = () => {
  const [specialization, setSpecialization] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const addSpecialization = () => {
    navigate("/add-specialization");
  };
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/specializations?offset=${offset}&limit=10&search=${search}`
      );
      const spec = res.data;
      const completeData = await Promise.all(
        spec.map(async (s) => {
          try {
            const doctorsIds = Array.isArray(s.doctors)
              ? s.doctors.map((doc) => doc.id).join(",")
              : s.doctors.id;
            const endPoint = Array.isArray(s.doctors) ? "/doctors-id" : "";

            const doctorsData = await axios.get(
              `http://localhost:8080/api/doctors${endPoint}/${doctorsIds}`
            );

            const doctors = doctorsData.data;
            return { ...s, doctors };
          } catch (error) {
            console.log(`Error fetching details for clinic ${s._id}:`, error);
            return { ...s, clinicDoctors: [] };
          }
        })
      );
      if (spec.length > 0) {
        setSpecialization((prev) => [...prev, ...completeData]);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  specialization.map((spec) =>
    spec.doctors.map((d) => console.log(d.last_name))
  );
  useEffect(() => {
    if (hasMoreData) {
      fetchData();
    }
  }, [offset, hasMoreData]);

  const handleSearch = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    if (newSearch === "") {
      window.location.reload();
    }
  };

  const searchSpecialization = () => {
    setOffset(0);
    setSpecialization([]);
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
  return (
    <>
      <div
        className="header"
        style={{
          background: "rgba(255, 255, 255)",
          padding: "10px",
          borderRadius: "5px",
          position: "sticky",
          top: 0,
          minHeight: 0,
          zIndex: 1,
        }}
      >
        <div className="d-flex justify-content-between">
          <div cassName="d-flex flex-column">
            <h1>Specializations</h1>
            <div className="d-flex gap-2">
              <Button
                sx={{
                  color: "black",
                  outline: "black",
                  border: "1px solid black",
                }}
              >
                Filter
              </Button>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <SearchComponent
              onClick={searchSpecialization}
              onChange={handleSearch}
              label={"Search Specializaton"}
            />
            <Button
              onClick={addSpecialization}
              sx={{
                color: "black",
                outline: "black",
                border: "1px solid black",
              }}
            >
              Add Specialization
            </Button>
          </div>
        </div>
      </div>
      <div className="w-500 vh-500 d-flex justify-content-center align-items-center ">
        <div className="w-100 h-20">
          <Table>
            <TableHead
              sx={{
                position: "sticky",
                top: 104.5,
                background: "rgba(255,255,255,0.9)",
                zIndex: 2,
              }}
            >
              <TableRow>
                <TableCell>
                  <h5>Specialization</h5>
                </TableCell>
                <TableCell>
                  <h5>Description</h5>
                </TableCell>
                <TableCell>
                  <h5>Doctors</h5>
                </TableCell>
                <TableCell>
                  <h5>Status</h5>
                </TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specialization?.map((spec) => {
                return (
                  <TableRow key={spec._id}>
                    <TableCell>{spec.specialty_name}</TableCell>
                    <TableCell>{spec.desc ? spec.desc : "None"}</TableCell>
                    <TableCell>
                      {spec.doctors.length >= 1 ? (
                        <Accordion sx={{ width: "160px" }}>
                          <AccordionSummary sx={{ paddingLeft: "40px" }}>
                            {" "}
                            {spec.doctors.length}{" "}
                            {spec.doctors.length > 1 ? "Doctors" : "Doctor"}
                          </AccordionSummary>
                          <AccordionDetails>
                            {}
                            {spec.doctors.map((d) => (
                              <span>
                                {`Dr. ${d.first_name}`} {d.last_name} {"   "}
                              </span>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      ) : (
                        <span style={{ paddingLeft: "30px" }}>
                          No Doctor yet
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {spec.is_active ? (
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
                    <TableCell sx={{ display: "flex", flexDirection: "row" }}>
                      {" "}
                      <Link
                        to={`/update-specialization/${spec._id}`}
                        className="btn"
                        style={{ display: "flex" }}
                      >
                        <EditIcon fontSize="small" />
                      </Link>
                      <Delete id={spec._id} endpoint={"specializations"} />
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

export default Specializations;
