import React, { useEffect, useContext, useState } from "react";
import { Box, Stack } from "@mui/material";
import { format } from "date-fns";
import AuthContext from "../context/AuthContext";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import SearchComponent from "./Search";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

const Chatlist = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user && user._id) {
      try {
        const socket = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);

        socket.addEventListener("open", (event) => {
          console.log("Websocket connected for inbox");
          socket.send(JSON.stringify({ doctor_receiver: user._id }));
        });

        socket.addEventListener("message", (e) => {
          const message = JSON.parse(e.data);
          console.log("received messages: ", message);
          setMessages(message.message);
        });

        return () => {
          socket.close();
        };
      } catch (error) {
        console.log(error);
        toast("Can't connect to the server");
      }
    }
  }, []);
  console.log(search);

  return (
    <div className="justify-content-center">
      <div>
        <Box
          sx={{
            position: "relative",
            alignSelf: "center",
            // left: "23%",
            height: "94vh",
            // width: "600px",
            border: "1px solid #ccc",
            marginTop: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 2px #ccc",
            padding: "10px",
            gap: "5px",
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <TextField
              label="search"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          {messages
            .filter((message) => {
              return message.sender?.first_name
                ?.toLowerCase()
                .includes(search.toLowerCase());
            })
            .map((message) => (
              <Accordion
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  marginTop: "5px",
                }}
                key={message._id}
              >
                <AccordionSummary>
                  <div className="d-flex flex-column row justify-content-between">
                    <span
                      className="col-auto"
                      style={{
                        fontSize: "10px",
                        bottom: "60%",
                      }}
                    >
                      {format(message.createdAt, "MMMM d, yyy hh:mm aa")}
                    </span>
                    <span
                      className="col-auto"
                      style={{
                        alignContent: "center",
                        fontWeight: "bold",
                        fontStyle: "Tahoma",
                      }}
                    >
                      {message.sender.first_name +
                        " " +
                        message.sender.last_name}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper
                    elevation={6}
                    style={{ height: "fit-content", padding: "10px" }}
                  >
                    {message.message.split(" ")[1]}
                  </Paper>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </div>
    </div>
  );
};

export default Chatlist;
