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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
  const [month, setMonth] = useState("");

  const fetchData = async () => {
    try {
      const appointment = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/appointments?offset=${offset}&limit=10&search=${search}&month=${month}`
      );
      console.log(appointment.data);
      // const apptData = appointment.data;
      if (appointment.data.length > 0) {
        setAppointments((prev) => [...prev, ...appointment.data]);
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
        setOffset((prevOffset) => prevOffset + 10);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

  const monthOptions = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];

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
          <div className="mt-3">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Choose Month"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
              }}
              sx={{ width: "200px", height: "40px" }}
            >
              {monthOptions.map((m) => (
                <MenuItem key={m.name} value={m.value}>
                  {" "}
                  {m.name}
                </MenuItem>
              ))}
            </Select>
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
                <TableCell></TableCell>
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
                    <TableCell>
                      {format(appt.date, "MMMM d, yyyy")} {appt.date}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {/* {appt?.appointmentStatus[0].status} */}
                      {appt?.appointmentStatus[0].status === "Cancelled" ? (
                        <StatusIndicator
                          background={"#b23d3c"}
                          status={appt?.appointmentStatus[0].status}
                          paddingLeft={"7px"}
                        />
                      ) : appt?.appointmentStatus[0].status === "Completed" ? (
                        <StatusIndicator
                          background={"#5a9f68"}
                          status={appt?.appointmentStatus[0].status}
                          paddingLeft={"4px"}
                        />
                      ) : appt?.appointmentStatus[0].status === "Confirmed" ? (
                        <StatusIndicator
                          background={"#69aeff"}
                          status={appt?.appointmentStatus[0].status}
                          paddingLeft={"5px"}
                        />
                      ) : appt?.appointmentStatus[0].status === "Scheduled" ? (
                        <StatusIndicator
                          background={"#ff6f69"}
                          status={appt?.appointmentStatus[0].status}
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
