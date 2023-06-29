import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/svg/logo.svg";

function Navbar(props) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("green");
  useEffect(() => {
    console.log("Navbar", window.location.pathname);
  }, []);

  return (
    <>
      <div className="flex flex-row w-full p-4 justify-between">
        {/* logo container */}
        <div className="flex flex-row items-center space-x-4 ml-4">
          <img
            src={logo}
            alt="Logo"
            className="h-20 w-20 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />

          <p
            className="text-3xl font-bold ml-2 text-custom-primary hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            Governex
          </p>
        </div>

        <div className="flex flex-row items-center">
          {/* menu container */}
          <div className="flex flex-row items-center space-x-8 mr-4">
            <div className="">
              <p
                className={`${
                  window.location.pathname === "/"
                    ? "border-b-4 border-custom-primary hover:cursor-pointer"
                    : "border-transparent hover:cursor-pointer hover:border-b-custom-primary hover:border-b-4"
                }`}
                onClick={() => navigate("/")}
              >
                Home
              </p>
            </div>
            <div className="">
              <p
                className={`${
                  window.location.pathname === "/whitepaper"
                    ? "border-b-4 border-custom-primary hover:cursor-pointer"
                    : "border-transparent hover:cursor-pointer hover:border-b-custom-primary hover:border-b-4"
                }`}
                onClick={() => navigate("/whitepaper")}
              >
                Whitepaper
              </p>
            </div>
            <div className="">
              <p
                className={`${
                  window.location.pathname === "/about-us"
                    ? "border-b-4 border-custom-primary hover:cursor-pointer"
                    : "border-transparent hover:cursor-pointer hover:border-b-custom-primary hover:border-b-4"
                }`}
                onClick={() => navigate("/about-us")}
              >
                About Us
              </p>
            </div>
            <div className="">
              <p
                className={`${
                  window.location.pathname === "/contact"
                    ? "border-b-4 border-custom-primary hover:cursor-pointer"
                    : "border-transparent hover:cursor-pointer hover:border-b-custom-primary hover:border-b-4"
                }`}
                onClick={() => navigate("/contact")}
              >
                Contact
              </p>
            </div>
            {props.appState.loggedIn ? (
              <div className="">
                <p
                  className={`${
                    window.location.pathname === "/dashboard"
                      ? "border-b-4 border-custom-primary hover:cursor-pointer font-bold"
                      : "border-transparent hover:cursor-pointer hover:border-b-custom-primary hover:border-b-4 font-bold"
                  }`}
                  onClick={() => {
                    if (
                      props.appState.account ===
                      "0x4A5B8807e404CFb3A944F9fAB9B673F560cF6031"
                    ) {
                      navigate("/admin/dashboard");
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                >
                  Dashboard
                </p>
              </div>
            ) : null}
            {props.appState.loggedIn ? (
              <div className="">
                <p className="font-bold">
                  {props.appState.account.substring(0, 6) +
                    "..." +
                    props.appState.account.substring(
                      props.appState.account.length - 4
                    )}
                </p>
              </div>
            ) : null}
          </div>

          {/* button */}
          {window.location.pathname.startsWith("/admin/") ? (
            props.appState.loggedIn === true ? (
              <button
                className="btn border-2 border-white  bg-custom-primary text-white capitalize mx-8 hover:border-2 hover:border-custom-primary hover:text-custom-primary"
                onClick={() => {
                  props.logout();
                  navigate("/admin/login");
                }}
              >
                Logout
              </button>
            ) : (
              <button
                className="btn border-2 border-white  bg-custom-primary text-white capitalize mx-8 hover:border-2 hover:border-custom-primary hover:text-custom-primary"
                onClick={() => navigate("/admin/login")}
              >
                Admin Login
              </button>
            )
          ) : props.appState.loggedIn ? (
            <button
              className="btn border-2 border-white  bg-custom-primary text-white capitalize mx-8 hover:border-2 hover:border-custom-primary hover:text-custom-primary"
              onClick={() => props.logout()}
            >
              Logout
            </button>
          ) : (
            <button
              className="btn border-2 border-white  bg-custom-primary text-white capitalize mx-8 hover:border-2 hover:border-custom-primary hover:text-custom-primary"
              onClick={() => navigate("/signin")}
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
