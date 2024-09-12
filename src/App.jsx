// import React from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import SideBar from "./components/SideBar";
import Campus from "./pages/Campus";
import Classroom from "./pages/Classroom";
import Contact from "./pages/Contact";
import Schedule from "./pages/Schedule";
import { Route, Switch } from "react-router-dom";
import WifiAccess from "./pages/WifiAccess";
import Faculties from "./pages/Faculties";
import Header from "./components/Header";
import AdminCall from "./pages/AdminCall";
import Announcement from "./pages/Announcement";
import illustration from "./assets/illustration.png";
import DateTime from "./components/DateTime";

function App() {
  return (
    <div className="flex overflow-hidden h-screen w-screen">
      <SideBar />
      <div className=" w-full flex flex-col bg-[#1b2531]">
        {/* <Header /> */}
        <div className="h-full w-full p-6">
          <Switch>
            <Route path="/" exact>
              <div className="flex flex-col w-full h-full gap-6 ">
                <div className="w-full flex basis-3/4 bg-black/35 rounded-2xl p-10 gap-10">
                  <div className="basis-3/4 flex flex-col h-full gap-10">
                    <h1 className="text-5xl font-bold">Welcome Back,</h1>
                    <span className="text-4xl text-gray-400">
                      Please select an action from the main menu on the left to
                      continue.
                    </span>
                    <div className="mt-auto text-gray-500">
                      You can manage announcements, check the schedule, view
                      contacts, or access the main setting.
                    </div>
                  </div>
                  <div className="basis-1/4 flex flex-col">
                    <img src={illustration} className="w-64 mt-auto" />
                  </div>
                </div>
                <div className="w-full basis-1/4 rounded-2xl bg-black/35">
                  <div className="flex justify-end items-center">
                    <DateTime />
                  </div>
                </div>
              </div>
            </Route>
            <Route path="/announcement">
              <Announcement />
            </Route>
            <Route path="/schedules">
              <Schedule />
            </Route>
            <Route path="/campus">
              <Campus />
            </Route>
            <Route path="/classroom">
              <Classroom />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/wifi-access">
              <WifiAccess />
            </Route>
            <Route path="/faculties">
              <Faculties />
            </Route>
            <Route path="/admin">
              <AdminCall />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
