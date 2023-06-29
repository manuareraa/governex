import React, { useState, useEffect } from "react";

import AdminSideNavbar from "../../components/AdminSideNavbar";
import { toast } from "react-hot-toast";

function Votes(props) {
  const [proposalCards, setProposalCards] = useState([]);

  const processProposalCards = async () => {
    let tempArr = [];
    setProposalCards([]);
    props.appState.allProposals.forEach((proposal) => {
      let element = (
        <div className="flex flex-row items-center justify-between w-full p-4 rounded-lg bg-custom-primary/20">
          <div className="flex flex-row items-center space-x-4">
            <div className="flex flex-col space-y-[-5px] w-16">
              <p className="text-xs font-light">Vote ID</p>
              <p className="text-xl font-bold">{proposal.id.toString()}</p>
            </div>
            <div className="flex flex-col space-y-[-5px] w-24">
              <p className="text-xs font-light">Votes Casted</p>
              <p className="text-xl font-bold">{parseInt(proposal.votes)}</p>
            </div>
            <div className="flex flex-col space-y-[-5px] w-20">
              <p className="text-xs font-light">Casting %</p>
              <p className="text-xl font-bold">
                {parseInt(
                  (proposal.voters / props.appState.tokenHoldersCount) * 100
                ) <= 0 ||
                isNaN(
                  parseInt(
                    (proposal.voters / props.appState.tokenHoldersCount) * 100
                  )
                ) === true
                  ? 0
                  : parseInt(
                      (proposal.voters / props.appState.tokenHoldersCount) * 100
                    )}{" "}
                %
              </p>
            </div>
            <div className="flex flex-col space-y-[-5px] w-20">
              <p className="text-xs font-light">Status</p>
              <p className="text-xl font-bold uppercase">{proposal.status}</p>
            </div>
            <div className="flex flex-col space-y-[-5px] w-60">
              <p className="text-xs font-light">Timestamp</p>
              <p className="text-xl font-bold">
                {proposal.timestamp.replace("at", "")}
              </p>
            </div>
            <div className="flex flex-col space-y-[-5px] w-44">
              <p className="text-xs font-light">Transaction Hash</p>
              <p className="text-xl font-bold">
                {proposal.txnHash
                  ? proposal.txnHash.substring(0, 6) +
                    "..." +
                    proposal.txnHash.substring(
                      proposal.txnHash.length - 6,
                      proposal.txnHash.length
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-4">
            <button
              className="px-4 text-white capitalize border-2 btn border-custom-primary w-44 bg-custom-primary hover:border-2 hover:border-custom-primary hover:text-custom-primary hover:bg-custom-secondary"
              onClick={() => {
                window.open(
                  "https://mumbai.polygonscan.com/tx/" + proposal.txnHash,
                  "_blank"
                );
              }}
            >
              Verify Hash
            </button>
            <button
              className={
                proposal.status === "open"
                  ? "btn border-2  border-custom-primary  bg-custom-primary text-white capitalize hover:border-2 hover:border-custom-primary hover:text-custom-primary px-16 hover:bg-custom-secondary"
                  : "disabled btn border-0  border-transparent hover:cursor-not-allowed bg-custom-primary/50 text-white/50 capitalize hover:border-transparent hover:text-white/50 px-16 hover:bg-custom-primary/50"
              }
              onClick={() => {
                if (proposal.status === "open") {
                  console.log("Closing vote", proposal.id);
                  props.closeVote(proposal.id);
                } else {
                  toast.error("Vote already closed");
                }
              }}
            >
              Publish
            </button>
          </div>
        </div>
      );
      tempArr.push(element);
      setProposalCards(tempArr);
    });
  };

  useEffect(() => {
    console.log("Votes page loaded", props.appState);
    if (props.appState.allProposals.length > 0) {
      processProposalCards();
    } else {
      console.log("No proposals to show");
    }
  }, [props.appState]);

  return (
    <div className="flex flex-col">
      {/* titlebar */}
      <div className="w-full px-8 py-2 bg-custom-primary">
        <p className="text-lg font-bold text-white">All Votes</p>
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
            <p className="text-lg font-bold text-white">All Votes</p>
          </div>

          {/* all votes */}

          <div className="flex flex-col space-y-4">
            {proposalCards.length > 0 ? (
              proposalCards
            ) : (
              <p className="py-4 text-4xl font-extrabold text-center text-custom-primary/30">
                No Votes to Show
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Votes;
