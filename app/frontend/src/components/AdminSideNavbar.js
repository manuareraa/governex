import React from "react";
import { useNavigate } from "react-router-dom";

function AdminSideNavbar(props) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col mt-4 space-y-2">
      <div
        className={
          window.location.pathname === "/admin/dashboard"
            ? "bg-custom-primary/50 px-5 rounded-r-md py-4 hover:cursor-pointer text-white w-48"
            : " w-48 bg-transparent px-5 rounded-r-md py-4 hover:cursor-pointer hover:text-white hover:bg-custom-primary/50"
        }
        onClick={() => navigate("/admin/dashboard")}
      >
        <p className="text-sm">Dashboard</p>
      </div>
      <div
        className={
          window.location.pathname === "/admin/new-vote"
            ? "bg-custom-primary/50 px-5 rounded-r-md py-4 hover:cursor-pointer text-white  w-48"
            : "  w-48 bg-transparent px-5 rounded-r-md py-4 hover:cursor-pointer hover:text-white hover:bg-custom-primary/50"
        }
        onClick={() => navigate("/admin/new-vote")}
      >
        <p className=" text-sm">New Vote</p>
      </div>
      <div
        className={
          window.location.pathname === "/admin/votes"
            ? "bg-custom-primary/50 px-5 rounded-r-md py-4 hover:cursor-pointer text-white w-48"
            : "w-48 bg-transparent px-5 rounded-r-md py-4 hover:cursor-pointer hover:text-white hover:bg-custom-primary/50"
        }
        onClick={() => navigate("/admin/votes")}
      >
        <p className="text-sm">Votes</p>
      </div>
      <div
        className={
          window.location.pathname === "/admin/token-holders"
            ? "bg-custom-primary/50 px-5 rounded-r-md py-4 hover:cursor-pointer text-white w-48"
            : "w-48 bg-transparent px-5 rounded-r-md py-4 hover:cursor-pointer hover:text-white hover:bg-custom-primary/50"
        }
        onClick={() => navigate("/admin/token-holders")}
      >
        <p className=" text-sm">Token Holders</p>
      </div>
      <div
        className={
          window.location.pathname === "/admin/send-tokens"
            ? "bg-custom-primary/50 px-5 rounded-r-md py-4 hover:cursor-pointer text-white w-48"
            : "w-48 bg-transparent px-5 rounded-r-md py-4 hover:cursor-pointer hover:text-white hover:bg-custom-primary/50"
        }
        onClick={() => navigate("/admin/send-tokens")}
      >
        <p className=" text-sm">Send Tokens</p>
      </div>
    </div>
  );
}

export default AdminSideNavbar;
