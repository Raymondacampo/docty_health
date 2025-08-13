"use client"; // If you're using Next.js App Router

import { useEffect, useState } from "react";
import Why_Docify from "./components/Index_section_one";
import About_us from "./components/Index_section_two";
import Opinions from "./components/Index_section_three";
import SearchBar from "./components/SearchBar";
import JoinUs from "./components/IndexSectionFour";
import { isAuthenticated } from "@/utils/auth";

export default function MainContent() {
  const user = isAuthenticated();

  return (
    <>
      <SearchBar />
      <About_us />
      <Opinions />
      <Why_Docify />
      <JoinUs user={user} />
    </>
  );
}
