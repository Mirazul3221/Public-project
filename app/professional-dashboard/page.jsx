import React from "react";
import Dashboard from "./compo/Dashboard";
import ProtectRoute from "../global/ProtectRoute";
import SuperHeader from "../user/components/SuperHeader";
import Footer from "../components/Footer";

const page = () => {
  return (
    <div>
      <ProtectRoute>
        <SuperHeader />
        <Dashboard />
        <Footer/>
      </ProtectRoute>
    </div>
  );
};

export default page;
