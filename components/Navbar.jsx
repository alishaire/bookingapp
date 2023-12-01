import Link from "next/link";
import React, { useContext, useState } from "react";
import { SessionProvider } from "@/Context";
import axios from "axios";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useContext(SessionProvider);
  const [showModel, setShowModel] = useState(false);

  const handleModel = () => {
    setShowModel(!showModel);
  };

  //   SIgnOut Fuction
  const SignOut = async () => {
    try {
      if (!window.confirm("Are you sure?")) {
        return;
      }

      const removeCookie = await axios.post("/api/user/logout");
      toast.success(removeCookie?.data?.message);
      setUser(null);
    } catch (error) {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-3 py-0">
        <div className="flex items-center gap-4">
          <i
            onClick={() => alert("Roko Zara Sabar Karo!")}
            className="bx bx-menu text-3xl text-[#555] cursor-pointer"
          ></i>
          <div className="flex items-center">
            <Link href="/" className="flex-none">
              <img
                src="/images/logo1.png"
                width={55}
                className="mx-auto w-[120px]"
              />
            </Link>
          </div>
        </div>
        {/* PROFILE START ============================*/}
        <>
          {user ? (
            <div className="flex py-2 group relative items-center gap-2 pr-4">
              <img
                onClick={handleModel}
                src={user.photo}
                alt="image here"
                className="rounded-full h-9 w-9 object-cover cursor-pointer border border-gray-300"
              />
              <div className="leading-3">
                <p className="text-[14px] capitalize font-medium">
                  {`${user.firstName} ${user.lastName}`}
                </p>
                <span
                  onClick={SignOut}
                  className="text-[11px] cursor-pointer text-red-500 hover:text-red-600"
                >
                  Logout
                </span>
              </div>

              {/* Profile Model Here */}
              <div
                className={`shade pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 group-hover:top-[100%] transition-all duration-500 bg-white absolute left-0 top-[130%] overflow-hidden rounded-md h-fit min-w-[100px] z-[1000000]`}
              >
                <ul className="px-4 py-4">
                  <li className="flex flex-col gap-2">
                    <Link
                      className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2"
                      href="/portal/profile"
                    >
                      <ion-icon name="person-outline"></ion-icon> Profile
                    </Link>
                    <Link
                      className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2"
                      href="/portal/profile/edit"
                    >
                      <ion-icon name="settings-outline"></ion-icon> Setting
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 pr-4">
              <img
                onClick={handleModel}
                className="rounded-full h-9 w-9 object-cover cursor-pointer"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1480"
                alt="image here"
              />
              <div className="leading-4">
                <p className="text-[12px] font-medium">John Doe</p>
                <span className="text-[11px] cursor-pointer hover:text-red-600">
                  Logout
                </span>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Navbar;