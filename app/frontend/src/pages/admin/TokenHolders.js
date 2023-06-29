import React, { useState, useEffect } from "react";
import AdminSideNavbar from "../../components/AdminSideNavbar";
import Web3 from "web3";
import { toast } from "react-hot-toast";

function TokenHolderCard({
  walletAddress,
  balance,
  handleInputChange,
  sendTokens,
  appState,
}) {
  const [tokenInput, setTokenInput] = useState("");

  const handleInputClick = () => {
    handleInputChange(walletAddress);
  };

  return (
    <div className="flex flex-row items-center w-full justify-between rounded-lg bg-custom-primary/20 p-4">
      {/* Rest of the token holder card code */}
      <div className="flex flex-row items-center space-x-8">
        <div className="flex flex-col space-y-[-5px] w-[540px]">
          <p className="text-xs font-light">Address</p>
          <p className="font-bold text-xl">
            {walletAddress}
            {/* {walletAddress.substring(0, 6) +x
                  "..." +
                  walletAddress.substring(
                    walletAddress.length - 6,
                    walletAddress.length
                  )} */}
          </p>
        </div>
        <div className="flex flex-col space-y-[-5px] w-36">
          <p className="text-xs font-light">Token Balance</p>
          <p className="font-bold text-xl">
            {parseFloat(
              Web3.utils.fromWei(balance.toString(), "ether")
            ).toFixed(2)}
          </p>
          {/* <p className="font-bold text-xl">
                {Number.isInteger(
                  parseFloat(Web3.utils.fromWei(balance.toString(), "ether"))
                )
                  ? parseFloat(Web3.utils.fromWei(balance.toString(), "ether"))
                  : parseFloat(
                      Web3.utils.fromWei(balance.toString(), "ether")
                    ).toFixed(3)}
              </p> */}
          {/* <p className="font-bold text-xl">{balance}</p> */}
        </div>
      </div>
      <div className="flex flex-row items-center space-x-4">
        <div className="flex flex-col space-y-[-5px] w-36">
          <input
            type="text"
            className="w-full bg-transparent focus:border-b-2 focus:border-custom-primary border-b-2 border-custom-primary focus:outline-none focus:ring-0 focus:ring-custom-primary focus:border-transparent"
            placeholder="Enter Amount"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onClick={handleInputClick}
          ></input>
        </div>
        {/* Rest of the code */}
        <button
          className="btn border-2  border-custom-primary  bg-custom-primary text-white capitalize hover:border-2 hover:border-custom-primary hover:text-custom-primary  hover:bg-custom-secondary"
          onClick={async () => {
            console.log("token amount", tokenInput, walletAddress);
            if (
              parseFloat(tokenInput) > appState.tokenBalance
              //   parseFloat(
              //     Web3.utils.fromWei(balance.toString(), "ether")
              //   ).toFixed(2)
            ) {
              toast.error("Insufficient Balance");
            } else {
              sendTokens(walletAddress, tokenInput);
            }
          }}
        >
          Send Tokens
        </button>
      </div>
    </div>
  );
}

function TokenHolders(props) {
  const [tokenHolderCards, setTokenHolderCards] = useState([]);

  const handleInputChange = (walletAddress) => {
    setTokenHolderCards((prevCards) => {
      return prevCards.map((card) => {
        if (card.key === walletAddress) {
          return React.cloneElement(card, {
            handleInputChange: handleInputChange,
          });
        } else {
          return React.cloneElement(card, {
            handleInputChange: () => {},
          });
        }
      });
    });
  };

  useEffect(() => {
    console.log("Token Holders Page", props.appState.tokenHoldersData);
    if (props.appState.tokenHoldersData[0].length > 0) {
      processTokenHolderCards();
    } else {
      console.log("No token holders data");
    }
  }, [props.appState]);

  const processTokenHolderCards = () => {
    setTokenHolderCards(
      props.appState.tokenHoldersData[0].map((address, index) => {
        let walletAddress = address;
        let balance = props.appState.tokenHoldersData[1][index];

        return (
          <TokenHolderCard
            key={walletAddress}
            walletAddress={walletAddress}
            balance={balance}
            handleInputChange={handleInputChange}
            sendTokens={props.sendTokens}
            appState={props.appState}
          />
        );
      })
    );
  };

  return (
    <div className="flex flex-col">
      {/* titlebar */}
      <div className="w-full py-2 px-8 bg-custom-primary">
        <p className="font-bold text-lg text-white">All Token Holders</p>
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
            <p className="font-bold text-lg text-white">All Token Holders</p>
          </div>

          <div className="flex flex-col space-y-4">
            {tokenHolderCards.length > 0 ? (
              tokenHolderCards
            ) : (
              <p className="font-extrabold text-4xl text-custom-primary/30 text-center py-4">
                No Token Holders
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenHolders;
