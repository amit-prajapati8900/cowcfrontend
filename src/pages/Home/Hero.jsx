import React from "react";
import { Button } from "@mui/material";

export default function Hero() {
  return (
    <div className="container-fluid text-center mt-5">
      <h1>Water Corporation Management System</h1>
      <img src="pip.jpg" alt="pip" className="img-fluid mt-5 mb-5" />
      <p className="lead">Efficiently manage billing, customers, complaints, and reports.</p>
      <div className="row mt-5">
        <div className="col-md-3">
    <div className="card p-3 mt-5 mb-5 ">
       <img src="tpk.png"  alt="tkp" className="im"/>
            <h5>Billing</h5>
            <p>Generate and manage bills easily.</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 mt-5 mb-5">
       <img src="costomer.jpg"  alt="costomer" className="im"/>
            <h5>Customers</h5>
            <p>Maintain customer records efficiently.</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 mt-5 mb-5">
       <img src="puri.png"  alt="puri" className="im"/>

            <h5>Complaints</h5>
            <p>Track and resolve complaints quickly.</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 mt-5 mb-5">
       <img src="pp.png"  alt="pp" className=""/>
            <h5>Reports</h5>
            <p>View analytics and charts.</p>
        </div>
      </div>

        <div className="mt-5 mb-5">
        <div className="mt-4">
        <Button variant="contained" color="primary" href="/login">
          Register
        </Button>
         <Button variant="outlined" color="secondary" href="/dashboard" style={{ marginLeft: "10px" }}>
          Go to Dashboard
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}