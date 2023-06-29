import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SideNavbar from "../components/SideNavbar";

function Vote(props) {
  const [found, setFound] = useState(false);
  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (votingId, option) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [votingId]: option,
    }));
  };

  function getOptionIndexById(voteDocuments, id, optionValue) {
    const voteDocument = voteDocuments.find((vote) => vote.id === id);
    if (voteDocument) {
      const options = voteDocument.options;
      const optionValues = Object.values(options);
      const index = optionValues.findIndex(
        (option) => option.option === optionValue
      );
      return index;
    }
    return -1; // Return -1 if no matching vote document found
  }

  const handleVoteSubmit = (votingId) => {
    const selectedOption = selectedOptions[votingId];
    const selectedOptionIndex = getOptionIndexById(
      props.appState.allProposals,
      votingId,
      selectedOption
    );
    console.log("Voting ID:", votingId);
    console.log("Selected Option:", selectedOption);
    console.log("Selected Option Index:", selectedOptionIndex);
    props.casteVote(votingId, selectedOptionIndex);
  };

  useEffect(() => {
    console.log("Vote page loaded", props.appState);
  }, []);

  useEffect(() => {
    const openVotings = props.appState.allProposals.filter(
      (voting) =>
        voting.status === "open" &&
        !props.appState.userProfile.votedProposalIDs.includes(voting.id)
    );
    setFound(openVotings.length === 0);
  }, [
    props.appState.allProposals,
    props.appState.userProfile.votedProposalIDs,
  ]);

  return (
    <div className="flex flex-col">
      {/* titlebar */}
      <div className="w-full px-8 py-2 bg-custom-primary">
        <p className="text-lg font-bold text-white">Vote</p>
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
          {/* recent voting heading */}
          <div className="flex flex-row items-center justify-between w-full px-8 py-2 my-4 rounded-lg bg-custom-primary">
            <p className="text-lg font-bold text-white">Cast your Vote</p>
          </div>

          {/* recent voting */}
          {/* ---------- */}

          {found ? (
            <div className="flex flex-col space-y-4 rounded-lg bg-custom-primary/20">
              <p className="w-full p-4 py-8 text-5xl font-bold text-center text-custom-primary/40">
                No Votings Available
              </p>
            </div>
          ) : (
            <div className="flex flex-col mb-8 space-y-4">
              {props.appState.allProposals.map((voting) => {
                if (
                  voting.status === "open" &&
                  !props.appState.userProfile.votedProposalIDs.includes(
                    voting.id
                  )
                ) {
                  return (
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
                                id={`${voting.id}-${voting.options[option].option}`}
                                name={`voting-${voting.id}`}
                                value={voting.options[option].option}
                                checked={
                                  selectedOptions[voting.id] ===
                                  voting.options[option].option
                                }
                                onChange={() =>
                                  handleOptionChange(
                                    voting.id,
                                    voting.options[option].option
                                  )
                                }
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
                        <button
                          className="w-40 text-white capitalize border-2 btn border-custom-primary bg-custom-primary hover:border-2 hover:border-custom-primary hover:text-custom-primary"
                          onClick={() => handleVoteSubmit(voting.id)}
                        >
                          Cast Vote
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vote;
