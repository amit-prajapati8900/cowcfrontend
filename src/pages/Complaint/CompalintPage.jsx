import React, { useState } from "react";
import ComplaintForm from "./ComplaintForm";
import ComplaintTable from "./ComplaintTable";
import ErrorBoundary from "./ErrorBoundary";   // ← yahan 'errorboundery' ki jagah 'ErrorBoundary' likho (case sensitive)

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);

  const handleComplaintRegistered = (newComplaint) => {
    setComplaints((prev) => [...prev, newComplaint]);   // better way
    console.log("New Complaint Registered:", newComplaint);
  };

  return (
    <ErrorBoundary>
      <ComplaintForm onComplaintRegistered={handleComplaintRegistered} />
      <ComplaintTable complaints={complaints} />
    </ErrorBoundary>
  );
}