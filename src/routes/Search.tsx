import React from "react";
import { useLocation } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  console.log(location);

  const search = new URLSearchParams(location.search).get("keyword");
  console.log(search);
  return <div>찾기</div>;
};

export default Search;
