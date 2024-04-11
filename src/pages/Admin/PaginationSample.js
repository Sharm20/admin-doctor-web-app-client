import React, { useEffect, useState } from "react";
import axios from "axios";
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

const PaginationSample = () => {
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/specializations?offset=${offset}&limit=10`
        );
        const data = res.data;
        setData((prev) => [...prev, ...data]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [offset]);

  useEffect(() => {
    const handleScroll = (e) => {
      const scrollHeight = e.target.documentElement.scrollHeight;
      const currentHeight =
        e.target.documentElement.scrollTop + window.innerHeight;
      if (currentHeight + 1 >= scrollHeight) {
        setOffset(offset + 10);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Specialization</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Doctors</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((spec) => {
            return (
              <TableRow key={spec._id}>
                <TableCell>{spec.specialty_name}</TableCell>
                <TableCell>{spec.desc ? spec.desc : "None"}</TableCell>
                <TableCell>
                  <div className="d-flex align-items-center gap-2">
                    Doctors
                    <KeyboardArrowRightIcon />
                  </div>
                </TableCell>
                <TableCell>
                  {spec.is_active ? "Active" : "Inactive"}
                </TableCell>{" "}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaginationSample;
