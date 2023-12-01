import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

// ASIDE LINKS ADDED
var navLinks = [
  { href: "/portal", lable: "Dashboard", icon: "bx bxs-dashboard" },
  { href: "/portal/sample", lable: "Sample Table", icon: "bx bx-user" },
  { href: "/portal/users", lable: "Users", icon: "bx bx-group" },
  {
    href: "/portal/certificates",
    lable: "Certificates",
    icon: "bx bx-badge-check",
  },
  {
    href: "/portal/instructor",
    lable: "Instructor",
    icon: "fa-solid fa-person-chalkboard",
  },
  {
    href: "/portal/getallcourses",
    lable: "Courses",
    icon: "bx bx-book-bookmark",
  },
  {
    href: "/portal/getallblogs",
    lable: "Blogs",
    icon: "bx bx-message-rounded-edit",
  },
  { href: "/portal/getallnews", lable: "News", icon: "bx bx-news" },
  {
    href: "/portal/getallquiers",
    lable: "Enquries",
    icon: "bx bx-data",
  },
  {
    href: "/portal/getallambassdor",
    lable: "Ambassdor",
    icon: "bx bxs-user-detail",
  },
];

const Sidebar = () => {
  const router = useRouter();
  const [toggle, setToggle] = useState(true);

  return (
    <aside
      style={{
        width: toggle ? "200px" : "48px",
        transition: ".6s",
      }}
      className={`lg:w-[200px] md:w-12 h- pr-4 mt-4 overflow-hidden flex flex-col justify-between`}
    >
      <div className="flex flex-col relative">
        <div className="flex flex-1 flex-col justify-between h-full">
          <ul className="text-sm">
            {navLinks.map((v, i) => {
              return (
                <>
                  <li key={i}>
                    <Link
                      href={v.href}
                      className={`relative py-[5px] px-4 flex items-center rounded-r-full hover:bg-[#1554a110] group cursor-pointer ${
                        router.pathname === v.href
                          ? "group cursor-pointer lg:bg-sky-50 md:bg-transparent"
                          : ""
                      }`}
                    >
                      <i
                        className={`${v.icon} text-base ${
                          router.pathname === v.href
                            ? "text-[#155399]"
                            : "text-gray-500"
                        }`}
                      ></i>
                      <div
                        style={{
                          opacity: toggle ? "1" : "0",
                          transition: ".5s",
                        }}
                        className={`ml-3 ${
                          router.pathname === v.href
                            ? "text-[#1b5597] font-semibold"
                            : "text-black"
                        }`}
                      >
                        {v.lable}
                      </div>
                    </Link>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="pl-2 mb-2">
        <span onClick={() => setToggle(!toggle)}>
          <ion-icon
            style={{
              transform: toggle ? "rotate(360deg)" : "rotate(180deg)",
              transition: ".4s",
            }}
            class="bg-gray-100 text-gray-600 active:bg-gray-400 cursor-pointer text-lg p-1 rounded-lg"
            name="arrow-back-outline"
          ></ion-icon>
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;