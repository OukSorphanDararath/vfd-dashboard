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
    <div className="border w-64 flex flex-col px-4 pb-4">
      <div className="h-20 flex items-center mx-auto">
        <h1 className="text-center ">
          <NavLink to="/">FD Dashboard</NavLink>
        </h1>
      </div>
      <ul className="flex flex-col gap-1 mt-4">
        {sideBarContent.map((item) => (
          <NavLink
            to={item.url}
            key={item.id}
            activeClassName="text-blue-950 bg-white"
             className="border p-2"
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
