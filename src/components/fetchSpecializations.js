import React from "react";
import axios from "axios";

const fetchSpecializations = async (ids) => {
  const endpoint = Array.isArray(ids) ? "/specializations-id" : "";
  const ids_string = Array.isArray(ids) ? ids.join(",") : ids;
  const specializationsData = await axios.get(
    `http://localhost:8080/api/specializations/${endpoint}/${ids_string}`
  );
  // console.log(specializationsData.data);
  return specializationsData.data;
};

export default fetchSpecializations;