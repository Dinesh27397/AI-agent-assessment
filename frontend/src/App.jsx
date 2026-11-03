import Layout from "./components/layout/Layout";
import Dashboard from "./modules/dashboard/Dashboard";
import Tickets from "./modules/tickets/Tickets";
import Sprint from "./modules/sprint/Sprint";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";

export default function App(){
 const [page,setPage]=useState("dashboard");
 return(
  <Layout>
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/sprint" element={<Sprint />} />
    </Routes>
  </Layout>
 )
}
