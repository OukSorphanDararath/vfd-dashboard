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

function App() {
  return (
    <div className="flex overflow-hidden h-screen w-screen">
      <SideBar />
      <div className=" w-full flex flex-col bg-[#1b2531]">
        <Header />
        <div className="h-full w-full p-6">
          <Switch>
            <Route path="/" exact>
              <>
                Welcome to PUC Virtual Front Desk, Please select your section to
                process.
              </>
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
