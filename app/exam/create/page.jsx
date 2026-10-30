"use client";

import { useState } from "react";
import ProtectRoute from "@/app/global/ProtectRoute";
import SuperHeader from "@/app/user/components/SuperHeader";
import { viewurl } from "@/app/config";
import { createExam } from "../api/api";
import { useStore } from "@/app/global/DataProvider";
import Footer from "@/app/components/Footer";
import CreateExamForm from "../components/CreateExamForm";

export default function Page() {
  return (
    <ProtectRoute>
      <SuperHeader />
        <CreateExamForm/>
      <Footer />
    </ProtectRoute>
  );
}
