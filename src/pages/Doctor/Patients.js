import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Delete from "../../components/Delete";
import { Link } from "react-router-dom";
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
import EditIcon from "@mui/icons-material/Edit";

const Patients = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3001`);

    socket.addEventListener("open", (event) => {
      console.log("Websocket connected");
      socket.send(JSON.stringify({ doctor_id: user._id }));
    });

    socket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      // console.log("Appointments: ", data.appointments);
      //   console.log(data.appointments.map((a) => a.patient));
      setAppointments(data.appointments);
      setPatients(data.appointments.map((a) => a.patient));
    });
  }, []);
  //   console.log("patients: ", patients);
  return (
    <>
      <div
        className="header mt-3"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          position: "sticky",
          top: 0,
          minHeight: 0,
          zIndex: 1,
        }}
      >
        <h2>Patients</h2>
      </div>

      <div className="w-500 vh-500 d-flex justify-content-center align-items-center">
        <div className="w-100 h-20">
          <Table>
            <TableHead
              sx={{
                position: "sticky",
                top: "100",
                background: "rgba(255,255,255,0.9)",
                zIndex: 2,
              }}
            >
              <TableRow>
                <TableCell>
                  <h5>Name</h5>
                </TableCell>
                <TableCell>
                  <h5>Gender</h5>
                </TableCell>
                <TableCell>
                  <h5>Age</h5>
                </TableCell>
                <TableCell>
                  <h5>Contact Number</h5>
                </TableCell>
                <TableCell>
                  <h5>Contact Person: </h5>
                </TableCell>
                <TableCell>
                  {" "}
                  <h5>Number</h5>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((p) => {
                return (
                  <TableRow key={p?._id}>
                    <TableCell>{p.first_name + " " + p.last_name}</TableCell>
                    <TableCell>{p.gender}</TableCell>
                    <TableCell>{p.date_of_birth}</TableCell>
                    <TableCell>{p.contact_num}</TableCell>
                    <TableCell>{p.contact_person}</TableCell>
                    <TableCell>{p.contact_p_number}</TableCell>
                    <TableCell sx={{ display: "flex", flexDirection: "row" }}>
                      <Link to={`/update-doctor/${p._id}`} className="btn">
                        <EditIcon fontSize="small" />
                      </Link>
                      {/* <Delete id={p._id} endpoint={"patients"} />    */}
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

export default Patients;
