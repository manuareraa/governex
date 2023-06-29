import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Routes, Route, useNavigate } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";

import Homepage from "./pages/Homepage";

import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NewVote from "./pages/admin/NewVote";
import TokenHolders from "./pages/admin/TokenHolders";

import contractABI from "./smart-contract/abi.json";
import AdminLogin from "./pages/admin/AdminLogin";
import Votes from "./pages/admin/Votes";
import SendTokens from "./pages/admin/SendTokens";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import Transactions from "./pages/Transactions";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    loading: false,
    message: "",
  });

  const [appState, setAppState] = useState({
    web3: null,
    account: "",
    contract: null,
    backendServer: "http://localhost:5454",
    contractAddress: "0x3f17c9224913C173a3cd3215739747d94638F126",
    proposalCount: 0,
    allProposals: [],
    tokenHoldersCount: 0,
    tokenHoldersData: [],
    tokenBalance: 0,
    totalVoteCount: 0,
    totalOpenVoteCount: 0,
    userProfile: {
      name: "",
      id: "",
      voteValue: 0,
      vote: 0,
      votedProposalIDs: [],
    },
    allTxnsByAddress: [],
    stats: {
      totalSupply: 0,
    },
  });

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading({
          loading: true,
          message: "Connecting to Metamask...",
        });
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setAppState((prevState) => {
          return { ...prevState, web3: web3 };
        });
        console.log("<< Web3 Object Received  >>");

        window.ethereum
          .request({ method: "net_version" })
          .then(async (chainId) => {
            if (chainId !== "80001") {
              try {
                await window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0x13881" }],
                });
                console.log("Polygon Mumbai Chain found.");
              } catch (switchError) {
                console.log("Error connecting to Polygon Mumbai Chain (1)");
              }
            }
          });

        const accounts = await web3.eth.getAccounts();
        console.log("<< Account Received  >>", accounts[0]);

        setAppState((prevState) => {
          return {
            ...prevState,
            account: accounts[0],
          };
        });
        setLoading({
          loading: false,
          message: "Connecting to Metamask...",
        });
      } catch (error) {
        console.error(error);
        console.log("Error getting web3 object. Install Metamask.");
        setLoading({
          loading: false,
          message: "Connecting to Metamask...",
        });
      }
    } else {
      console.log("Please install MetaMask to connect your wallet.");
    }
  };

  const disconnectWallet = async () => {
    console.log("<< Wallet Disconnect Called  >>");
    setAppState((prevState) => {
      return {
        ...prevState,
        account: "",
      };
    });
  };

  const signup = async () => {
    console.log("<< Signup Called  >>");

    const id = Math.floor(100000000000 + Math.random() * 900000000000);

    console.log("[+] ID Generated: ", id);

    axios
      .post(`${appState.backendServer}/signup`, {
        walletAddress: appState.account,
        name: appState.account,
        id: id,
        voteValue: 0,
        votes: 0,
      })
      .then((response) => {
        console.log("[+] Signup Successful", response.data);
        toast.success("Signup Successful. Please Sign In.");
        navigate("/signin");
      })
      .catch((error) => {
        console.log("[-] Signup Failed", error);
        toast.error("Signup Failed. Please try again. Account already exists.");
      });
  };

  const signin = async () => {
    console.log("<< Signin Called  >>");
    axios
      .post(`${appState.backendServer}/signin`, {
        walletAddress: appState.account,
      })
      .then((response) => {
        console.log("[+] Signin Successful", response.data.user);
        setAppState((prevState) => {
          return {
            ...prevState,
            loggedIn: true,
            userProfile: {
              name: response.data.user.name,
              id: response.data.user.id,
              voteValue: response.data.user.voteValue,
              vote: response.data.user.vote,
              votedProposalIDs: response.data.user.votedProposalIDs,
            },
          };
        });
        toast.success("Signin Successful.");
        navigate("/dashboard");
        getTokenHoldersCount();
        getAllProposalsFromBackend();
        getTokenBalance();
        getOpenVoteCounts();
        getAllTxnsByAddress(appState.account);
        getStatsFromSmartContract();
      })
      .catch((error) => {
        console.log("[-] Signin Failed", error);
        toast.error(
          "Signin Failed. Invalid Credentials/Account does not exist."
        );
      });
  };

  const logout = async () => {
    console.log("<< Logout Called  >>");
    setAppState((prevState) => {
      return {
        ...prevState,
        loggedIn: false,
        userProfile: {},
        account: "",
      };
    });
    toast.success("Logout Successful.");
    navigate("/");
  };

  const getProposalCountFromContract = async () => {
    console.log("<< Get Proposal Count Called  >>");
    const contract = new appState.web3.eth.Contract(
      contractABI,
      appState.contractAddress
    );

    const proposalCount = await contract.methods.proposalCount().call();

    console.log("[+] Proposal Count: ", proposalCount);

    setAppState((prevState) => {
      return {
        ...prevState,
        proposalCount: parseInt(proposalCount),
      };
    });
  };

  const getTokenHoldersCount = async () => {
    console.log("<< Get Token Holders Count Called  >>");
    const contract = new appState.web3.eth.Contract(
      contractABI,
      appState.contractAddress
    );

    const tokenHoldersCount = await contract.methods
      .getTotalTokenHolders()
      .call();

    console.log("[+] Token Holders Count: ", tokenHoldersCount);

    setAppState((prevState) => {
      return {
        ...prevState,
        tokenHoldersCount: parseInt(tokenHoldersCount),
      };
    });
  };

  const createProposal = async (question, options) => {
    console.log("<< Create Proposal Called  >>");
    const contract = new appState.web3.eth.Contract(
      contractABI,
      appState.contractAddress
    );

    let txnHash = "";
    const proposal = await contract.methods
      .createProposal(options.length)
      .send({ from: appState.account })
      .on("transactionHash", (hash) => {
        console.log("[+] Transaction Hash: ", hash);
        txnHash = hash;
      })
      .on("receipt", (receipt) => {
        console.log("[+] Receipt: ", receipt);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(
          "[+] Confirmation Number: ",
          confirmationNumber.confirmations,
          parseInt(confirmationNumber.confirmations) === 1,
          confirmationNumber.confirmations === "1"
        );
        // console.log("[+] Receipt: ", receipt);

        if (parseInt(confirmationNumber.confirmations) === 1) {
          console.log("[+] Proposal Created Successfully in Smart Contract");
          toast.success("Proposal Created Successfully in Smart Contract");
          const id = appState.proposalCount;
          axios
            .post(`${appState.backendServer}/createProposal`, {
              id: id,
              question: question,
              options: options,
              timestamp: new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }).format(new Date()),
              txnHash: txnHash,
              rawTimestamp: new Date().getTime(),
            })
            .then((response) => {
              console.log("[+] Proposal Created Successfully in Backend");
              toast.success(
                "Proposal Created Successfully updated in Database"
              );
              getProposalCountFromContract();
              getAllProposalsFromBackend();
            })
            .catch((error) => {
              console.log("[-] Proposal Creation Failed in Backend", error);
              toast.error("Proposal Creation Failed in Backend.");
            });
        }
      })
      .on("error", (error) => {
        console.log("[-] Error: ", error);
      });
  };

  const getAllProposalsFromBackend = async () => {
    console.log("<< Get All Proposals Called  >>");
    axios
      .get(`${appState.backendServer}/getAllProposals`)
      .then((response) => {
        console.log("[+] All Proposals: ", response.data);
        setAppState((prevState) => {
          return {
            ...prevState,
            allProposals: response.data.proposals,
          };
        });
      })
      .catch((error) => {
        console.log("[-] Error: ", error);
      });
  };

  const adminLogin = async () => {
    console.log("<< Admin Login Called  >>");
    setAppState((prevState) => {
      return { ...prevState, loggedIn: true };
    });
    getTokenHoldersCount();
    getAllProposalsFromBackend();
    getAllTokenHoldersData();
    getTokenBalance();
    getTotalVoteCount();
    getOpenVoteCounts();
    getStatsFromSmartContract();
    navigate("/admin/dashboard");
  };

  const getAllTokenHoldersData = async () => {
    console.log("<< Get All Token Holders Data Called  >>");
    // from smart contract
    try {
      const contract = new appState.web3.eth.Contract(
        contractABI,
        appState.contractAddress
      );
      const tokenHoldersData = await contract.methods.getTokenHolders().call();
      console.log("[+] Token Holders Data: ", tokenHoldersData);
      setAppState((prevState) => {
        return {
          ...prevState,
          tokenHoldersData: tokenHoldersData,
        };
      });
    } catch (error) {
      console.log("[-] Error: ", error);
      toast.error(
        "Error in fetching Token Holders Data from Smart Contract. Please logout and login."
      );
    }
  };

  const sendTokens = async (receiver, amount) => {
    console.log("<< Send Tokens Called  >>", receiver, amount);
    const contract = new appState.web3.eth.Contract(
      contractABI,
      appState.contractAddress
    );

    let txnHash = "";
    try {
      await contract.methods
        .transfer(receiver, Web3.utils.toWei(amount, "ether"))
        .send({ from: appState.account })
        .on("transactionHash", (hash) => {
          console.log("[+] Transaction Hash: ", hash);
          txnHash = hash;
        })
        .on("receipt", (receipt) => {
          console.log("[+] Receipt: ", receipt);
        })
        .on("confirmation", async (confirmationNumber, receipt) => {
          console.log(
            "[+] Confirmation Number: ",
            confirmationNumber.confirmations,
            parseInt(confirmationNumber.confirmations) === 1,
            confirmationNumber.confirmations === "1"
          );
          // console.log("[+] Receipt: ", receipt);

          if (parseInt(confirmationNumber.confirmations) === 1) {
            console.log("[+] Tokens Sent Successfully in Smart Contract");
            // toast.success("Tokens Sent Successfully in Smart Contract");
            await axios
              .post(`${appState.backendServer}/save-txn`, {
                sender: appState.account,
                receiver: receiver,
                amount: amount,
                timestamp: new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }).format(new Date()),
                txnHash: txnHash,
                txnType: "admin-send",
                rawTimestamp: new Date().getTime(),
              })
              .then((response) => {
                console.log("[+] Tokens Sent Successfully in Backend");
                toast.success("Transaction Saved Successfully in Database");
                // wait 3 seconds and then call getAllTokenHoldersData
                console.log("<< Waiting 3 seconds >>");
                setTimeout(() => {
                  getAllTokenHoldersData();
                }, 3000);
                console.log("<< Token Data Retrieved >>");
              })
              .catch((error) => {
                console.log("[-] Tokens Sending Failed in Backend", error);
                toast.error("Tokens Sending Failed in Backend.");
              });
          }
        })
        .on("error", (error) => {
          console.log("[-] Error: ", error);
        });
    } catch (error) {
      console.log("[-] Error: ", error);
      toast.error("Error occured in Metamask or Input Data.");
    }
  };

  const getTokenBalance = async () => {
    console.log("<< Get Admin Balance Called  >>");
    const contract = new appState.web3.eth.Contract(
      contractABI,
      appState.contractAddress
    );
    const balance = await contract.methods.balanceOf(appState.account).call();
    console.log("[+] Balance: ", balance);
    setAppState((prevState) => {
      return {
        ...prevState,
        tokenBalance: Web3.utils.fromWei(balance, "ether"),
      };
    });
  };

  const getTotalVoteCount = async () => {
    // from backend
    console.log("<< Get Total Vote Count Called  >>");
    axios
      .get(`${appState.backendServer}/get-total-vote-count`)
      .then((response) => {
        console.log("[+] Total Vote Count: ", response.data);
        setAppState((prevState) => {
          return {
            ...prevState,
            totalVoteCount: response.data.totalVoteCount,
          };
        });
      })
      .catch((error) => {
        console.log("[-] Error: ", error);
      });
  };

  const getOpenVoteCounts = async () => {
    // from backend
    console.log("<< Get Open Vote Counts Called  >>");
    axios
      .get(`${appState.backendServer}/get-total-open-vote-count`)
      .then((response) => {
        console.log("[+] Open Vote Counts: ", response.data);
        setAppState((prevState) => {
          return {
            ...prevState,
            totalOpenVoteCount: response.data.totalOpenVoteCount,
          };
        });
      })
      .catch((error) => {
        console.log("[-] Error: ", error);
      });
  };

  const casteVote = async (voteId, optionId) => {
    console.log("<< Caste Vote Called  >>");
    const contract = new appState.web3.eth.Contract(
      contractABI,
      appState.contractAddress
    );

    let txnHash = "";
    try {
      await contract.methods
        .vote(voteId, optionId)
        .send({ from: appState.account })
        .on("transactionHash", (hash) => {
          console.log("[+] Transaction Hash: ", hash);
          txnHash = hash;
        })
        .on("receipt", (receipt) => {
          console.log("[+] Receipt: ", receipt);
        })
        .on("confirmation", async (confirmationNumber, receipt) => {
          console.log(
            "[+] Confirmation Number: ",
            confirmationNumber.confirmations,
            parseInt(confirmationNumber.confirmations) === 1,
            confirmationNumber.confirmations === "1"
          );
          // console.log("[+] Receipt: ", receipt);

          if (parseInt(confirmationNumber.confirmations) === 1) {
            console.log("[+] Vote Casted Successfully in Smart Contract");
            // toast.success("Vote Casted Successfully in Smart Contract");
            await axios
              .post(`${appState.backendServer}/vote`, {
                voter: appState.account,
                voteValue: appState.tokenBalance,
                voteId: voteId,
                optionId: optionId,
                timestamp: new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }).format(new Date()),
                txnHash: txnHash,
                txnType: "vote-casted",
                rawTimestamp: new Date().getTime(),
              })
              .then((response) => {
                console.log("[+] Vote Casted Successfully in Backend");
                toast.success("Transaction Saved Successfully in Database");
                // wait 3 seconds and then call getAllTokenHoldersData
                console.log("<< Waiting 3 seconds >>");
                setTimeout(async () => {
                  await getAllTokenHoldersData();
                  await getAllProposalsFromBackend();
                  await getUserProfile();
                }, 3000);
                console.log("<< Token Data Retrieved >>");
              })
              .catch((error) => {
                console.log("[-] Vote Casting Failed in Backend", error);
                toast.error("Vote Casting Failed in Backend.");
              });
          }
        })
        .on("error", (error) => {
          console.log("[-] Error: ", error);
        });
    } catch (error) {
      console.log("[-] Error: ", error);
      toast.error("Error occured in Metamask or Input Data.");
    }
  };

  const closeVote = async (voteId) => {
    console.log("<< Caste Vote Called  >>", voteId);
    const contract = new appState.web3.eth.Contract(
      contractABI,
      appState.contractAddress
    );

    let txnHash = "";
    try {
      await contract.methods
        .closeProposal(voteId)
        .send({ from: appState.account })
        .on("transactionHash", (hash) => {
          console.log("[+] Transaction Hash: ", hash);
          txnHash = hash;
        })
        .on("receipt", (receipt) => {
          console.log("[+] Receipt: ", receipt);
        })
        .on("confirmation", async (confirmationNumber, receipt) => {
          console.log(
            "[+] Confirmation Number: ",
            confirmationNumber.confirmations,
            parseInt(confirmationNumber.confirmations) === 1,
            confirmationNumber.confirmations === "1"
          );

          if (parseInt(confirmationNumber.confirmations) === 1) {
            console.log("[+] Vote Casted Successfully in Smart Contract");
            // toast.success("Vote Casted Successfully in Smart Contract");
            await axios
              .post(`${appState.backendServer}/close-proposal`, {
                proposalId: voteId,
              })
              .then((response) => {
                console.log("[+] Vote Casted Successfully in Backend");
                toast.success("Transaction Saved Successfully in Database");
                // wait 3 seconds and then call getAllTokenHoldersData
                console.log("<< Waiting 3 seconds >>");
                setTimeout(() => {
                  getAllTokenHoldersData();
                  getAllProposalsFromBackend();
                }, 3000);
                console.log("<< Token Data Retrieved >>");
              })
              .catch((error) => {
                console.log("[-] Vote Casting Failed in Backend", error);
                toast.error("Vote Casting Failed in Backend.");
              });
          }
        })
        .on("error", (error) => {
          console.log("[-] Error: ", error);
        });
    } catch (error) {
      console.log("[-] Error: ", error);
      toast.error("Error occured in Metamask or Input Data.");
    }
  };

  const getAllTxnsByAddress = (address) => {
    console.log("<< Get All Txns By Address Called  >>");
    axios
      .get(`${appState.backendServer}/get-all-txns-by-address/${address}`)
      .then((response) => {
        console.log("[+] All Txns By Address: ", response.data);
        setAppState((prevState) => {
          return {
            ...prevState,
            allTxnsByAddress: response.data.transactions,
          };
        });
      })
      .catch((error) => {
        console.log("[-] Error: ", error);
      });
  };

  const getUserProfile = async () => {
    console.log("<< Get User Profile Called  >>");
    await axios
      .post(`${appState.backendServer}/get-user-profile`, {
        walletAddress: appState.account,
      })
      .then((response) => {
        console.log("[+] Profile Fetch Successful", response.data.user);
        setAppState((prevState) => {
          return {
            ...prevState,
            userProfile: {
              name: response.data.user.name,
              id: response.data.user.id,
              voteValue: response.data.user.voteValue,
              vote: response.data.user.vote,
              votedProposalIDs: response.data.user.votedProposalIDs,
            },
          };
        });
      })
      .catch((error) => {
        console.log("[-] Signin Failed", error);
        toast.error(
          "Signin Failed. Invalid Credentials/Account does not exist."
        );
      });
  };

  const getStatsFromSmartContract = async () => {
    console.log("<< Get Stats From Smart Contract Called  >>");
    const contract = new appState.web3.eth.Contract(
      contractABI,
      appState.contractAddress
    );

    try {
      const totalSupply = await contract.methods.totalSupply().call();

      console.log("[+] Total Supply: ", totalSupply);

      setAppState((prevState) => {
        return {
          ...prevState,
          stats: {
            ...prevState.stats,
            totalSupply: Web3.utils.fromWei(totalSupply, "ether"),
          },
        };
      });
    } catch (error) {
      console.log("[-] Error: ", error);
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Toaster />
      <Navbar appState={appState} logout={logout} />
      <div className="">
        {loading.loading === true ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : null}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<h1>404</h1>} />
          <Route
            path="/signup"
            element={
              <Signup
                appState={appState}
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
                signup={signup}
              />
            }
          />
          <Route
            path="/signin"
            element={
              <Signin
                appState={appState}
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
                signin={signin}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard appState={appState} />}
          />
          <Route
            path="/vote"
            element={<Vote appState={appState} casteVote={casteVote} />}
          />
          <Route path="/results" element={<Results appState={appState} />} />
          <Route
            path="/transactions"
            element={<Transactions appState={appState} />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard appState={appState} />}
          />

          <Route
            path="/admin/new-vote"
            element={
              <NewVote
                appState={appState}
                connectWallet={connectWallet}
                getProposalCountFromContract={getProposalCountFromContract}
                createProposal={createProposal}
              />
            }
          />

          <Route
            path="/admin/login"
            element={
              <AdminLogin
                appState={appState}
                adminLogin={adminLogin}
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
              />
            }
          />

          <Route
            path="/admin/votes"
            element={<Votes appState={appState} closeVote={closeVote} />}
          />
          <Route
            path="/admin/token-holders"
            element={
              <TokenHolders appState={appState} sendTokens={sendTokens} />
            }
          />
          <Route
            path="/admin/send-tokens"
            element={<SendTokens appState={appState} sendTokens={sendTokens} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
