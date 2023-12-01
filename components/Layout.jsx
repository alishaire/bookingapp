import React, { useState } from "react";
import { useRouter } from "next/router";
import BreadCrums from "./BreadCums";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { pathname, back } = useRouter();

  var privateRoutes = pathname.startsWith("/dashboard");

  return (
    <div>
      {privateRoutes ? (
        <div
          style={{ fontFamily: "Inter" }}
          className="max-h-screen flex flex-col h-screen"
        >
          <div className="w-full">
            <Navbar />
          </div>
          <div className="flex flex-1">
            <Sidebar />
            <div className="overflow-y-auto flex-1 bg-gray-50 shadow-[inset_0px_0px_10px_rgba(56,56,56,0.2)] p-4">
              {pathname === "/portal/profile" ? (
                <>
                  <BreadCrums
                    Heading={pathname.split("/portal/")}
                    BtnText="Add User"
                  />
                </>
              ) : (
                <BreadCrums
                  Heading={pathname.split("/portal/")}
                  BtnText="Add"
                />
              )}
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* <NavBar /> */}
          {children}
        </div>
      )}

      {/* {!privateRoutes && <Footer />} */}
    </div>
  );
};

export default Layout;
