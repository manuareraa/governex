import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

import SideNavbar from "../components/SideNavbar";

function Transactions(props) {
  const navigate = useNavigate();
  const [txnCards, setTxnCards] = useState([]);

  const processTxnCards = async () => {
    let tempArr = [];
    setTxnCards([]);
    props.appState.allTxnsByAddress.forEach((txn) => {
      let element = (
        <div className="flex flex-row items-center w-full justify-between rounded-lg bg-custom-primary/20 p-4">
          {/* Rest of the token holder card code */}
          <div className="flex flex-row items-center space-x-8">
            <div className="flex flex-col space-y-[-5px] w-[180px]">
              <p className="text-xs font-light">Txn Hash</p>
              <p className="font-bold text-xl">
                {txn.txnHash.substring(0, 6) +
                  "..." +
                  txn.txnHash.substring(
                    txn.txnHash.length - 6,
                    txn.txnHash.length
                  )}
              </p>
            </div>
            <div className="flex flex-col space-y-[-5px] w-[100px]">
              <p className="text-xs font-light">Votes Casted</p>
              <p className="font-bold text-xl">{txn.voteValue}</p>
            </div>
            <div className="flex flex-col space-y-[-5px] w-16">
              <p className="text-xs font-light">Vote ID</p>
              <p className="font-bold text-xl">{txn.voteId}</p>
            </div>
            <div className="flex flex-col space-y-[-5px] w-60">
              <p className="text-xs font-light">Timestamp</p>
              <p className="font-bold text-xl">{txn.timestamp}</p>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-4">
            <button
              className="btn border-2  border-custom-primary  bg-custom-primary text-white capitalize hover:border-2 hover:border-custom-primary hover:text-custom-primary  hover:bg-custom-secondary"
              onClick={async () => {
                window.open(
                  `https://mumbai.polygonscan.com/tx/${txn.txnHash}`,
                  "_blank"
                );
              }}
            >
              Verify Hash
            </button>
          </div>
        </div>
      );
      tempArr.push(element);
      setTxnCards(tempArr);
    });
  };

  useEffect(() => {
    console.log(props.appState.allTxnsByAddress);
    processTxnCards();
  }, [props.appState]);

  return (
    <div className="flex flex-col">
      {/* titlebar */}
      <div className="w-full py-2 px-8 bg-custom-primary">
        <p className="font-bold text-lg text-white">Transactions</p>
      </div>

      {/* main window */}
      <div className="w-full flex flex-row space-x-6">
        {/* left sidebar */}
        <SideNavbar />

        {/* right dashboard */}
        <div className="flex flex-col w-full mt-4 px-4">
          {/* top status */}
          <div className=" flex flex-row space-x-4">
            {/* token balance */}
            <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
              <p>Your Token Balance</p>
              <div className="flex flex-row items-end space-x-2">
                <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                  {parseFloat(props.appState.tokenBalance).toFixed(2)}
                </p>
                <p className="font-bold text- text-custom-primary leading-10">
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
          <div className=" flex flex-row justify-between items-center  w-full py-2 px-8 bg-custom-primary my-4 rounded-lg">
            <p className="font-bold text-lg text-white">Transactions</p>
          </div>

          {/* recent voting */}
          {/* ---------- */}

          {txnCards.length > 0 ? (
            <div className="flex flex-col space-y-4">{txnCards}</div>
          ) : (
            <div className="flex flex-col space-y-4 bg-custom-primary/20  rounded-lg">
              <p className="w-full text-center font-bold text-5xl text-custom-primary/40 p-4 py-8">
                No Transactions to Show
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
