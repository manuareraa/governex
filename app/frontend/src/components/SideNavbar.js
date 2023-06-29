import React from "react";
import { useNavigate } from "react-router-dom";

function SideNavbar(props) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col mt-4 space-y-2">
      <div
        className={
          window.location.pathname === "/dashboard"
            ? "bg-custom-primary/50 px-20 rounded-r-md py-4 hover:cursor-pointer text-white"
            : "bg-transparent px-20 rounded-r-md py-4 hover:cursor-pointer hover:text-white hover:bg-custom-primary/50"
        }
        onClick={() => navigate("/dashboard")}
      >
        <p className="text-sm">Dashboard</p>
      </div>
      <div
        className={
          window.location.pathname === "/vote"
            ? "bg-custom-primary/50 px-20 rounded-r-md py-4 hover:cursor-pointer text-white"
            : "bg-transparent px-20 rounded-r-md py-4 hover:cursor-pointer hover:text-white hover:bg-custom-primary/50"
        }
        onClick={() => navigate("/vote")}
      >
        <p className=" text-sm">Vote</p>
      </div>
      <div
        className={
          window.location.pathname === "/results"
            ? "bg-custom-primary/50 px-20 rounded-r-md py-4 hover:cursor-pointer text-white"
            : "bg-transparent px-20 rounded-r-md py-4 hover:cursor-pointer hover:text-white hover:bg-custom-primary/50"
        }
        onClick={() => navigate("/results")}
      >
        <p className="text-sm">Results</p>
      </div>
      <div
        className={
          window.location.pathname === "/transactions"
            ? "bg-custom-primary/50 px-20 rounded-r-md py-4 hover:cursor-pointer text-white"
            : "bg-transparent px-20 rounded-r-md py-4 hover:cursor-pointer hover:text-white hover:bg-custom-primary/50"
        }
        onClick={() => navigate("/transactions")}
      >
        <p className=" text-sm">Transactions</p>
      </div>
    </div>
  );
}

export default SideNavbar;
