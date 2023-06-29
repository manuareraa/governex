import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

import SideNavbar from "../components/SideNavbar";

function Dashboard(props) {
  const navigate = useNavigate();
  const [resultCards, setResultCards] = useState([]);
  const [votingCards, setVotingCards] = useState([]);

  const processResultCards = async () => {
    let tempArr = [];
    setResultCards([]);
    props.appState.allProposals.forEach((voting) => {
      let totalVotes = parseInt(voting.votes);
      console.log("voting", voting.options);
      const optionWithMoreVotes = Object.keys(voting.options).reduce((a, b) =>
        voting.options[a].votes > voting.options[b].votes ? a : b
      );
      console.log("optionWithMoreVotes", optionWithMoreVotes);
      let element = (
        <div
          key={voting.id}
          className="flex flex-col p-4 space-y-4 rounded-lg bg-custom-primary/20"
        >
          <div className="flex flex-row items-center justify-between w-full">
            <p className="font- text-lg text-black w-[600px]">
              {voting.question}
            </p>
            <div className="p-2 text-white rounded-lg bg-custom-primary/40">
              VNo.{voting.id}
            </div>
          </div>
          <div className="flex flex-row items-end justify-between w-full">
            <div className="flex flex-col space-y-3">
              {Object.keys(voting.options).map((option) => (
                <>
                  <div
                    className="flex flex-row items-center space-x-4"
                    key={voting.options[option].option}
                  >
                    <div className="w-[170px]">
                      <p>
                        {parseInt(voting.options[option].votes)} votes (
                        {(
                          (voting.options[option].votes / totalVotes) *
                          100
                        ).toFixed(2)}
                        %)
                      </p>
                    </div>
                    <div
                      className={
                        parseInt(optionWithMoreVotes) === parseInt(option)
                          ? "w-6 h-6 rounded-full border-2 border-custom-primary/40 bg-custom-primary/40"
                          : "w-6 h-6 rounded-full border-2 border-custom-primary/40"
                      }
                    />
                    <label
                      htmlFor={`${voting.id}-${voting.options[option].option}`}
                      className="text-lg font-bold text-black"
                    >
                      {voting.options[option].option}
                    </label>
                  </div>
                </>
              ))}
            </div>
            {/* <button
              className="w-40 text-white capitalize border-2 btn border-custom-primary bg-custom-primary hover:border-2 hover:border-custom-primary hover:text-custom-primary"
              disabled={true}
            >
              Cast Vote
            </button> */}
          </div>
        </div>
      );
      tempArr.push(element);
      setResultCards(tempArr);
    });
  };

  const processVotingCards = async () => {
    let tempArr = [];
    setVotingCards([]);
    props.appState.allProposals.forEach((voting) => {
      if (
        voting.status === "open" &&
        props.appState.userProfile.votedProposalIDs.includes(voting.id) ===
          false
      ) {
        let element = (
          <div
            key={voting.id}
            className="flex flex-col p-4 space-y-4 rounded-lg bg-custom-primary/20"
          >
            <div className="flex flex-row items-center justify-between w-full">
              <p className="font- text-lg text-black w-[600px]">
                {voting.question}
              </p>
              <div className="p-2 text-white rounded-lg bg-custom-primary/40">
                VNo.{voting.id}
              </div>
            </div>
            <div className="flex flex-row items-end justify-between w-full">
              <div className="flex flex-col space-y-3">
                {Object.keys(voting.options).map((option) => (
                  <div
                    className="flex flex-row items-center space-x-4"
                    key={voting.options[option].option}
                  >
                    <input
                      type="radio"
                      disabled={true}
                      id={`${voting.id}-${voting.options[option].option}`}
                      name={`voting-${voting.id}`}
                      value={voting.options[option].option}
                      className="w-6 h-6 border-2 rounded-full border-custom-primary/40"
                    />
                    <label
                      htmlFor={`${voting.id}-${voting.options[option].option}`}
                      className="text-lg font-bold text-black"
                    >
                      {voting.options[option].option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        tempArr.push(element);
        setVotingCards(tempArr);
      }
    });
  };

  useEffect(() => {
    console.log("**", props.appState.allProposals);
    processResultCards();
    processVotingCards();
  }, [props.appState]);
  return (
    <div className="flex flex-col mb-12">
      {/* titlebar */}
      <div className="w-full px-8 py-2 bg-custom-primary">
        <p className="text-lg font-bold text-white">Dashboard</p>
      </div>

      {/* main window */}
      <div className="flex flex-row w-full space-x-6">
        {/* left sidebar */}
        <SideNavbar />

        {/* right dashboard */}
        <div className="flex flex-col w-full px-4 mt-4">
          {/* top status */}
          <div className="flex flex-row space-x-4 ">
            {/* token balance */}
            <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
              <p>Your Token Balance</p>
              <div className="flex flex-row items-end space-x-2">
                <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                  {parseFloat(props.appState.tokenBalance).toFixed(2)}
                </p>
                <p className="font-bold leading-10 text- text-custom-primary">
                  VIDAO
                </p>
              </div>
            </div>

            {/* votes casted */}
            <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
              <p>Votes Casted</p>
              <div className="flex flex-row items-end space-x-2">
                <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                  {props.appState.userProfile.vote}
                </p>
              </div>
            </div>

            {/* open for vote */}
            <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
              <p>Open for Vote</p>
              <div className="flex flex-row items-end space-x-2">
                <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                  {props.appState.totalOpenVoteCount}
                </p>
              </div>
            </div>
          </div>
          {/* recent votings heading */}
          <div className="flex flex-row items-center justify-between w-full px-8 py-2 my-4 mt-8 rounded-lg bg-custom-primary">
            <p className="text-lg font-bold text-white">Recent Votings</p>
            <p
              className="text-sm text-white underline hover:cursor-pointer"
              onClick={() => navigate("/vote")}
            >
              View All
            </p>
          </div>

          {/* recent votings */}
          <div className="flex flex-col space-y-4 rounded-lg bg-custom-primary/20">
            {votingCards.length > 0 ? (
              votingCards[0]
            ) : (
              <p className="w-full p-4 py-8 text-5xl font-bold text-center text-custom-primary/40">
                No Recent Votings
              </p>
            )}
          </div>

          {/* recent results heading */}
          <div className="flex flex-row items-center justify-between w-full px-8 py-2 my-4 mt-8 rounded-lg bg-custom-primary">
            <p className="text-lg font-bold text-white">Recent Results</p>
            <p
              className="text-sm text-white underline hover:cursor-pointer"
              onClick={() => navigate("/results")}
            >
              View All
            </p>
          </div>

          {/* recent results */}
          {/* ---------- */}
          <div className="flex flex-col space-y-2">
            {resultCards.length > 0 ? (
              resultCards[0]
            ) : (
              <div className="flex flex-col space-y-4 rounded-lg bg-custom-primary/20">
                <p className="w-full p-4 py-8 text-5xl font-bold text-center text-custom-primary/40">
                  No Recent Results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
