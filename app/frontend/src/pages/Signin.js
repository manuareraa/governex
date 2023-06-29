import React from "react";
import { useNavigate } from "react-router-dom";

function Signin(props) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center mt-16">
      <div className="flex flex-col bg-custom-secondary rounded-[30px] items-center p-16 w-fit space-y-4 px-28">
        <p className="text-xl font-bold">Sign In</p>
        {props.appState.account === "" ? (
          <button
            className="btn border-2 border-white  bg-custom-primary text-white capitalize mx-8 hover:border-2 hover:border-custom-primary hover:text-custom-primary px-16 hover:bg-custom-secondary"
            onClick={() => {
              props.connectWallet();
            }}
          >
            Connect your Wallet
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text font-bold">
              {props.appState.account.slice(0, 6) +
                "..." +
                props.appState.account.slice(-4)}
            </p>
            <p className="text-xs mb-4">Wallet Connected</p>
            <button
              className="btn border-2 w-[400px] border-white mb-2  bg-custom-primary text-white capitalize mx-8 hover:border-2 hover:border-custom-primary hover:text-custom-primary px-16 hover:bg-custom-secondary"
              onClick={() => {
                props.disconnectWallet();
              }}
            >
              Disconnect Wallet
            </button>

            <button
              className="btn border-2 w-[400px] border-white  bg-custom-primary text-white capitalize mx-8 hover:border-2 hover:border-custom-primary hover:text-custom-primary px-16 hover:bg-custom-secondary"
              onClick={() => {
                props.signin();
              }}
            >
              Sign In with Connected Wallet
            </button>
          </div>
        )}
      </div>
      <p className="mt-8">
        Do not have an account?&nbsp;
        <span
          className="text-custom-primary font-bold underline hover:cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Signup
        </span>
      </p>
    </div>
  );
}

export default Signin;
