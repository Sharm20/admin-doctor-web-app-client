import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import SearchComponent from "../../components/Search";
import Delete from "../../components/Delete";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import StatusIndicator from "../../components/StatusIndicator";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const appointment = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/appointments?offset=${offset}&limit=15&search=${search}`
      );
      console.log(appointment.data);
      // const apptData = appointment.data;
      const apptData = await Promise.all(
        appointment.data.map(async (appt) => {
          try {
            const doctors = await axios.get(
              `${process.env.REACT_APP_SERVER_URL}/api/doctors/${appt.doctor}`
            );

            const clinics = await axios.get(
              `${process.env.REACT_APP_SERVER_URL}/api/clinics/${appt.clinic}`
            );
            const doctor = doctors.data ? doctors.data : "undefined";
            const clinic = clinics.data ? clinics.data : "undefined";
            return { ...appt, doctor, clinic };
          } catch (error) {
            console.error(
              `Error fetching doctor details for appointment ${appt._id}:`,
              error
            );
            setAppointments(appointment.data);
          }
        })
      );
      if (appointment.data.length > 0) {
        setAppointments((prev) => [...prev, ...apptData]);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(appointments);

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

  const searchAppointment = () => {
    setOffset(0);
    setAppointments([]);
    setHasMoreData(true);
    fetchData();
  };

  useEffect(() => {
    const handleScroll = () => {
      console.log("scroll detected");
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = window.scrollY + window.innerHeight;
      if (currentHeight + 1 >= scrollHeight) {
        setOffset((prevOffset) => prevOffset + 15);
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
          top: 0,
          // height: "10px",
          minHeight: "50px",
          zIndex: 1,
        }}
      >
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column mt-3">
            <h1>Appointments</h1>
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
          <div className="d-flex align-items-center gap-3 mt-3">
            <SearchComponent
              onChange={handleSearch}
              onClick={searchAppointment}
              label={"Search Patient Name"}
            />
          </div>
        </div>
      </div>
      <div className="w-500 vh-500 d-flex justify-content-center align-items-center">
        <div className="w-100 h-20">
          <Table>
            <TableHead
              sx={{
                position: "sticky",
                top: 72,
                background: "rgba(255,255,255,0.9)",
                zIndex: 2,
              }}
            >
              <TableRow>
                <TableCell>
                  <h5>Clinic</h5>
                </TableCell>
                <TableCell>
                  <h5>Doctor</h5>
                </TableCell>
                <TableCell>
                  <h5>Patient</h5>
                </TableCell>
                <TableCell>
                  <h5>Date</h5>
                </TableCell>
                <TableCell>
                  <h5>Time</h5>
                </TableCell>
                <TableCell>
                  <h5>Status</h5>
                </TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments?.map((appt) => {
                return (
                  <TableRow key={appt?._id}>
                    <TableCell>
                      {appt?.clinic?.clinic_code
                        ? appt.clinic?.clinic_code
                        : "undefined"}
                    </TableCell>
                    <TableCell>
                      Dr. {appt?.doctor.first_name} {appt?.doctor.last_name}
                    </TableCell>
                    <TableCell>
                      {appt?.patient.first_name} {appt?.patient.last_name}
                    </TableCell>
                    {console.log(appt?.patient.first_name)}
                    <TableCell>April 6, 2024</TableCell>
                    <TableCell>{appt?.timeslot}</TableCell>
                    <TableCell>
                      {appt?.appointmentStatus[0].status === "Cancelled" ? (
                        <StatusIndicator
                          background={"#b23d3c"}
                          status={appt?.status}
                          paddingLeft={"7px"}
                        />
                      ) : appt?.status === "Completed" ? (
                        <StatusIndicator
                          background={"#5a9f68"}
                          status={appt?.status}
                          paddingLeft={"4px"}
                        />
                      ) : appt?.status === "Confirmed" ? (
                        <StatusIndicator
                          background={"#69aeff"}
                          status={appt?.status}
                          paddingLeft={"5px"}
                        />
                      ) : appt?.status === "Scheduled" ? (
                        <StatusIndicator
                          background={"#ff6f69"}
                          status={appt?.status}
                          paddingLeft={"5px"}
                        />
                      ) : (
                        <StatusIndicator
                          background={"gray"}
                          status={"Pending"}
                          paddingLeft={"12px"}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ display: "flex", flexDirection: "row" }}>
                      {/* <Link to={`/update-doctor/${appt._id}`} className="btn">
                        <EditIcon fontSize="small" />
                      </Link> */}
                      <Delete id={appt?._id} endpoint={"appointments"} />
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

export default Appointments;
