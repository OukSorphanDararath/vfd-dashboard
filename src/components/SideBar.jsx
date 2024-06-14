import React from "react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const sideBarContent = [
    { id: 0, title: "Class Room", url: "/classroom", icon: "" },
    { id: 1, title: "Campus", url: "/campus", icon: "" },
    { id: 2, title: "WIFI Access", url: "/wifi-access", icon: "" },
    { id: 3, title: "Schedules", url: "/schedules", icon: "" },
    { id: 4, title: "Faculties", url: "/faculties", icon: "" },
    { id: 5, title: "Contacts", url: "/contact", icon: "" },
  ];

  return (
    <div className="bg-[#283142] w-64 flex flex-col px-5 pb-4">
      <div className="h-20 flex items-center mx-auto">
        <h1 className="text-center font-semibold text-lg">
          <NavLink to="/">FD Dashboard</NavLink>
        </h1>
      </div>
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
      {/* <div className="flex flex-col mt-auto gap-2">
        <span>Setting</span>
        <span>Logout</span>
      </div> */}
    </div>
  );
};

export default SideBar;
