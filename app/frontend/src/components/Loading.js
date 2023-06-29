import React from "react";

import LoadingSVG from "../assets/svg/loading.svg";

function Loading(props) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen modal modal-open bg-white/90">
      <img src={LoadingSVG} alt="Loading" className="w-40 h-40" />
      <p className="text-xl font-bold">{props.loading.message}</p>
      {props.loading === "error" ? (
        <button
          className="px-4 py-2 mt-8 text-white bg-custom-primary"
          onClick={() => props.setLoading({ status: false, message: "" })}
        >
          Close
        </button>
      ) : null}
    </div>
  );
}

export default Loading;
