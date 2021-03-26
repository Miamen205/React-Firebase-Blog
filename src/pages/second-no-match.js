import React from "react";
import { Link } from "react-router-dom";

const SecondNoMatch = () => (
  <>
    <h1>Hmmm... can't seem to find that page.</h1>
    <Link to="/home">Take me home</Link>
  </>
);

export default SecondNoMatch;