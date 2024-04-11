import React from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";

const Delete = ({ endpoint, id }) => {
  const handleDelete = async () => {
    try {
      const deleletItem = await axios.delete(
        `http://localhost:8080/api/${endpoint}/${id}`
      );

      if (deleletItem) {
        console.log(deleletItem.data);
        await toast.success("DELETED");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Request failed");
      }
    }
  };
  return (
    <IconButton onClick={handleDelete}>
      <DeleteIcon />
    </IconButton>
  );
};

export default Delete;
