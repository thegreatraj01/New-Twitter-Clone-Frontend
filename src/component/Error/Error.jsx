import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="text-center my-5">
      <h2 className="display-4">Error, page not found</h2>
      <p className="lead">
        Please go back to Home <br />
      </p>

      <Link
        to="/"
        className="btn btn-primary"
      >
        Home
      </Link>
    </div>
  );
};

export default Error;
