import React from 'react'
import ComplaintTable from '../Complaint/ComplaintTable'
import CustomerTable from '../Customer/CustomerTable'
import BillingTable from '../Billing/BillingTable'
import Status from '../Customer/Status'
// import TopConsumers from '../Report/TopConsumer'
import Customer from '../Customer/Customer'
import CustomerPage from '../Customer/CustomerPage'
export default function Dashboard() {
  return (
    <>
    <h1> Counsumer</h1>
    {/* <TopConsumers /> */}
    <h1>this Complaint</h1>
    <div>
    <ComplaintTable/>
    </div>
    <h1>this is Customer</h1>
    <div>
    <CustomerPage/>
    </div>
    <h1>this is Analysis of Customer How Many User uses water</h1>
    <h1>this is Billing </h1>
    <div>
    <BillingTable />.
    {/* <Status /> */}
    </div>
    </>
  )
}
