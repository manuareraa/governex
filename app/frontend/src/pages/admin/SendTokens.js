import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AdminSideNavbar from "../../components/AdminSideNavbar";

function SendTokens(props) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="flex flex-col">
      {/* titlebar */}
      <div className="w-full py-2 px-8 bg-custom-primary">
        <p className="font-bold text-lg text-white">Send Tokens</p>
      </div>

      {/* main window */}
      <div className="w-full flex flex-row space-x-6">
        {/* left sidebar */}
        <AdminSideNavbar />

        {/* right dashboard */}
        <div className="flex flex-col w-full mt-4 px-4 mb-8">
          <p className="font-extrabold text-6xl text-custom-primary py-2 pb-0">
            Admin
          </p>

          {/* recent voting heading */}
          <div className="flex flex-row justify-between items-center w-full py-2 px-8 bg-custom-primary my-4 rounded-lg">
            <p className="font-bold text-lg text-white">Send Tokens</p>
          </div>

          <div className="flex flex-col w-full mt-12 items-center">
            <div className="flex flex-col items-center rounded-xl bg-custom-primary/20 px-16 py-12 space-y-4 w-fit">
              <div className="flex flex-col">
                <p className="font-light text-xs text-black">
                  Receiver Address
                </p>
                <input
                  type="text"
                  className="w-96 h-10 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-custom-primary focus:ring-opacity-50"
                  placeholder="Enter Receiver Address"
                  onChange={(e) => setAddress(e.target.value)}
                ></input>
              </div>
              <div className="flex flex-col pb-4">
                <p className="font-light text-xs text-black">Amount to Send</p>
                <input
                  type="text"
                  className="w-96 h-10 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-custom-primary focus:ring-opacity-50"
                  placeholder="Enter Amount to Send"
                  onChange={(e) => setAmount(e.target.value)}
                ></input>
              </div>

              <button
                className=" btn border-2  border-custom-primary  bg-custom-primary text-white capitalize hover:border-2 hover:border-custom-primary hover:text-custom-primary  hover:bg-custom-secondary"
                onClick={() => {
                  console.log("Send Tokens", address, amount);
                  if (address.length > 0 && amount.length > 0) {
                    if (parseFloat(amount) > props.appState.tokenBalance) {
                      toast.error("Amount is greater than admin balance");
                      return;
                    } else {
                      props.sendTokens(address, amount);
                    }
                  } else {
                    toast.error("Please fill all the fields");
                  }
                }}
              >
                Send Tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendTokens;
