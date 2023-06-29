import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AdminSideNavbar from "../../components/AdminSideNavbar";
import { toast } from "react-hot-toast";

function NewVote(props) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const voteDetails = {
      question,
      options,
    };
    console.log(voteDetails);
  };

  useEffect(() => {
    if (props.appState.account !== "") {
      props.getProposalCountFromContract();
    } else {
      console.log("Please connect your wallet first.");
      toast.error("Please connect your wallet first.");
      navigate("/admin/login");
    }
  }, []);

  return (
    <div className="flex flex-col">
      {/* titlebar */}
      <div className="w-full px-8 py-2 bg-custom-primary">
        <p className="text-lg font-bold text-white">New Vote</p>
      </div>

      {/* main window */}
      <div className="flex flex-row w-full space-x-6">
        {/* left sidebar */}
        <AdminSideNavbar />

        {/* right dashboard */}
        <div className="flex flex-col w-full px-4 mt-4 mb-8">
          <p className="py-2 pb-0 text-6xl font-extrabold text-custom-primary">
            Admin
          </p>

          {/* recent voting heading */}
          <div className="flex flex-row items-center justify-between w-full px-8 py-2 my-4 rounded-lg bg-custom-primary">
            <p className="text-lg font-bold text-white">Create Vote</p>
          </div>

          <p>
            Upcoming Proposal ID:{" "}
            <bold>{props.appState.proposalCount}</bold>
          </p>

          {/* form */}
          <form onSubmit={handleSubmit} className="w-full">
            {/* question input */}
            <div className="mt-4 w-[600px]">
              <label
                className="block mb-2 font-medium text-gray-700"
                htmlFor="question"
              >
                Question
              </label>
              <textarea
                id="question"
                name="question"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={question}
                onChange={handleQuestionChange}
                required
              ></textarea>
            </div>

            {/* options */}
            <div className="mt-4 w-[600px]">
              <label className="block mb-2 font-medium text-gray-700">
                Options
              </label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <span className="w-4 mr-2 text-gray-700">{index + 1}.</span>
                  <input
                    type="text"
                    className="w-[400px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={option}
                    onChange={(e) => handleOptionChange(e, index)}
                    required
                  />
                  <div className="flex flex-row space-x-0">
                    {index === options.length - 1 && (
                      <button
                        type="button"
                        className="mx-4 text-white capitalize border-2 border-white btn bg-custom-primary hover:border-2 hover:border-custom-primary hover:text-custom-primary"
                        onClick={handleAddOption}
                      >
                        +
                      </button>
                    )}
                    {index > 0 && (
                      <button
                        type="button"
                        className="mx-4 text-white capitalize border-2 border-white btn bg-custom-primary hover:border-2 hover:border-custom-primary hover:text-custom-primary"
                        onClick={() => handleRemoveOption(index)}
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* submit button */}
            {props.appState.account !== "" ? (
              <button
                type="submit"
                className="mx-4 mt-8 text-white capitalize border-2 border-white btn bg-custom-primary hover:border-2 hover:border-custom-primary hover:text-custom-primary"
                onClick={() => {
                  console.log("Submit button clicked", question, options);
                  props.createProposal(question, options);
                  setOptions([""]);
                  setQuestion("");
                }}
              >
                Submit
              </button>
            ) : (
              <button
                type="submit"
                className="mx-4 mt-8 text-white capitalize border-2 border-white btn bg-custom-primary hover:border-2 hover:border-custom-primary hover:text-custom-primary"
                onClick={() => props.connectWallet()}
              >
                Connect Wallet
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewVote;
