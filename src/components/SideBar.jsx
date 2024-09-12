import React from "react";
import { NavLink } from "react-router-dom";
import pucLogo from "../assets/puc-logo.png";
import needHelpInfo from "../assets/need-help.png";
import { useHistory, useLocation } from "react-router-dom";

const SideBar = () => {
  const sideBarContent = [
    // { id: 0, title: "Class Room", url: "/classroom", icon: "" },
    { id: 7, title: "Announcement", url: "/announcement", icon: "" },
    // { id: 1, title: "Campus", url: "/campus", icon: "" },
    // { id: 2, title: "WIFI Access", url: "/wifi-access", icon: "" },
    { id: 3, title: "Schedules", url: "/schedules", icon: "" },
    // { id: 4, title: "Faculties", url: "/faculties", icon: "" },
    { id: 5, title: "Contacts", url: "/contact", icon: "" },
    { id: 6, title: "Admin Call", url: "/admin", icon: "" },
  ];

  const history = useHistory();

  return (
    <div className="bg-[#283142] w-64 flex flex-col px-5 pb-4">
      <div
        className="h-20 flex flex-col items-center mx-auto mt-4"
        onClick={() => history.push("/")}
      >
        <img src={pucLogo} className="w-14 h-14" />
        <h1 className="text-center font-semibold text-lg mt-2">
          <NavLink to="/">FD Dashboard</NavLink>
        </h1>
      </div>
      <hr className="mt-8 text-gray-600"></hr>
      <ul className="flex flex-col gap-4 mt-4">
        {sideBarContent.map((item) => (
          <NavLink
            to={item.url}
            key={item.id}
            activeClassName="text-white bg-[#032ea2]"
            className="px-5 py-2 rounded-2xl"
          >
            {item.title}
          </NavLink>
        ))}
      </ul>
      <img src={needHelpInfo} className="mt-auto" />
      {/* <div className="flex flex-col mt-auto gap-2">
        <span>Setting</span>
        <span>Logout</span>
        </div> */}
    </div>
  );
};

export default SideBar;
