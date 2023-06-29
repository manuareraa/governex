import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

import SideNavbar from "../components/SideNavbar";
import AdminSideNavbar from "../components/AdminSideNavbar";

function AdminDashboard(props) {
  const navigate = useNavigate();
  const [proposalCards, setProposalCards] = useState([]);
  const [totalVotersCount, setTotalVotersCount] = useState(0);
  const [closedProposalCount, setClosedProposalCount] = useState(0);
  const [totalAverageVotingPercentage, setTotalAverageVotingPercentage] =
    useState(0);

  const votersChartRef = useRef(null);
  const voteValuesChartRef = useRef(null);
  const dChart = useRef(null);

  
  const initializeDChart = () => {
    const ctx = dChart.current.getContext("2d");
    const label = "Total Supply: " + parseInt(props.appState.stats.totalSupply).toString();
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Your Balance", "Token Holders"],
        datasets: [
          {
            label: label,
            data: [
              parseInt(props.appState.tokenBalance),
              parseInt(props.appState.stats.totalSupply) -
                parseInt(props.appState.tokenBalance),
            ],
            backgroundColor: ["#3B31A8", "#5e52d9"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  };

  const initializeVotersChart = () => {
    const ctx = votersChartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: props.appState.allProposals.map((proposal) =>
          proposal.id.toString()
        ),
        datasets: [
          {
            label: "Number of Voters",
            data: props.appState.allProposals.map(
              (proposal) => proposal.voters
            ),
            backgroundColor: "#3B31A8",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
            grid: {
              display: false, // Hide the grid lines
            },
          },
          x: {
            grid: {
              display: false, // Hide the grid lines
            },
          },
        },
      },
    });
  };

  const initializeVoteValuesChart = (data) => {
    const ctx = voteValuesChartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: props.appState.allProposals.map((proposal) =>
          proposal.id.toString()
        ),
        datasets: [
          {
            label: "Total Vote Values",
            data: props.appState.allProposals.map((proposal) =>
              parseInt(proposal.votes)
            ),
            backgroundColor: "#3B31A8",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
            grid: {
              display: false, // Hide the grid lines
            },
          },
          x: {
            grid: {
              display: false, // Hide the grid lines
            },
          },
        },
      },
    });
  };

  const processProposalCards = async () => {
    let tempArr = [];
    setProposalCards([]);

    // sort the props.appState.allProposasls array. Should be based on the rawTimestamp
    props.appState.allProposals.sort((a, b) => {
      return a.rawTimestamp - b.rawTimestamp;
    });

    let modArr = [];
    modArr.push(props.appState.allProposals[0]);

    modArr.forEach((proposal) => {
      let element = (
        <div className="flex flex-row items-center justify-between w-full p-4 rounded-lg bg-custom-primary/20">
          <div className="flex flex-row items-center space-x-4">
            <div className="flex flex-col space-y-[-3px] w-16">
              <p className="text-xs font-light">Vote ID</p>
              <p className="text-xl font-bold">{proposal.id.toString()}</p>
            </div>
            <div className="flex flex-col space-y-[-3px] w-24">
              <p className="text-xs font-light">Votes Casted</p>
              <p className="text-xl font-bold">{parseInt(proposal.votes)}</p>
            </div>
            <div className="flex flex-col space-y-[-3px] w-20">
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
            <div className="flex flex-col space-y-[-3px] w-20">
              <p className="text-xs font-light">Status</p>
              <p className="text-xl font-bold uppercase">{proposal.status}</p>
            </div>
            <div className="flex flex-col space-y-[-3px] w-60">
              <p className="text-xs font-light">Timestamp</p>
              <p className="text-xl font-bold">
                {proposal.timestamp.replace("at", "")}
              </p>
            </div>
            <div className="flex flex-col space-y-[-3px] w-44">
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
            {/* <button className="px-16 text-white capitalize border-2 btn border-custom-primary bg-custom-primary hover:border-2 hover:border-custom-primary hover:text-custom-primary hover:bg-custom-secondary">
              Publish
            </button> */}
          </div>
        </div>
      );
      tempArr.push(element);
      setProposalCards(tempArr);
    });
  };

  const getTotalVotersCount = async () => {
    let totalVotersCount = 0;
    await props.appState.allProposals.forEach((proposal) => {
      totalVotersCount += parseInt(proposal.voters);
    });
    setTotalVotersCount(totalVotersCount);
  };

  const getClosedProposalCount = async () => {
    let closedProposalCount = 0;
    await props.appState.allProposals.forEach((proposal) => {
      if (proposal.status === "closed") {
        closedProposalCount++;
      }
    });
    setClosedProposalCount(closedProposalCount);
  };

  const calculateTotalAverageVotingPercentage = async () => {
    let votings = 0;

    await props.appState.allProposals.forEach((proposal) => {
      votings +=
        (parseInt(proposal.voters) / props.appState.tokenHoldersCount) * 100;
    });

    let percent = votings / props.appState.allProposals.length;

    setTotalAverageVotingPercentage(percent);
  };

  useEffect(() => {
    console.log("Votes page loaded", props.appState);
    if (props.appState.allProposals.length > 0) {
      processProposalCards();
      getTotalVotersCount();
      getClosedProposalCount();
      calculateTotalAverageVotingPercentage();
      // initializeVoteValuesChart();
      // initializeVotersChart();
    } else {
      console.log("No proposals to show");
    }
  }, [props.appState]);

  useEffect(() => {
    console.log("Init charts...");
    if (props.appState.allProposals.length > 0) {
      initializeVoteValuesChart();
      initializeVotersChart();
      initializeDChart();
    } else {
      console.log("No proposals to show");
    }
  }, []);

  return (
    <div className="flex flex-col mb-8">
      {/* titlebar */}
      <div className="w-full px-8 py-2 bg-custom-primary">
        <p className="text-lg font-bold text-white">Dashboard</p>
      </div>

      {/* main window */}
      <div className="flex flex-row w-full space-x-6">
        {/* left sidebar */}
        <AdminSideNavbar />

        {/* right dashboard */}
        <div className="flex flex-col w-full px-4 mt-4">
          <p className="py-2 pb-6 text-6xl font-extrabold text-custom-primary">
            Admin
          </p>
          {/* <button
            onClick={() => {
              console.log("state", props.appState);
            }}
          >
            State
          </button> */}

          <div className="flex flex-col space-y-4">
            {/* top status */}
            <div className="flex flex-row space-x-4 ">
              {/* token balance */}
              <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
                <p>Your Token Balance</p>
                <div className="flex flex-row items-end space-x-2">
                  <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                    {parseFloat(props.appState.tokenBalance).toFixed(2)}
                    {/* {Web3.utils.fromWei(
                    props.appState.tokenBalance.toString(),
                    "ether"
                  )} */}
                  </p>
                  <p className="font-bold leading-10 text- text-custom-primary">
                    VIDAO
                  </p>
                </div>
              </div>

              {/* votes casted */}
              <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
                <p>Total Vote Value Casted</p>
                <div className="flex flex-row items-end space-x-2">
                  <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                    {parseInt(props.appState.totalVoteCount)}
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

              {/* total voters */}
              <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
                <p>Total Voters Recorded</p>
                <div className="flex flex-row items-end space-x-2">
                  <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                    {totalVotersCount}
                  </p>
                </div>
              </div>
            </div>

            {/* second row */}
            <div className="flex flex-row space-x-4 ">
              {/* closed */}
              <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
                <p>Closed</p>
                <div className="flex flex-row items-end space-x-2">
                  <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                    {parseInt(closedProposalCount)}
                  </p>
                </div>
              </div>

              {/* token holders */}
              <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
                <p>Total Token Holders</p>
                <div className="flex flex-row items-end space-x-2">
                  <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                    {props.appState.tokenHoldersCount}
                  </p>
                </div>
              </div>

              {/* average voting percentage */}
              <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
                <p>Average Voting Percentage</p>
                <div className="flex flex-row items-end space-x-2">
                  <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                    {totalAverageVotingPercentage.toFixed(2) + "%"}
                  </p>
                </div>
              </div>

              {/* total supply */}
              <div className="p-8 px-14 flex flex-col rounded-[30px] border-2 border-custom-primary bg-custom-primary/10 w-fit space-y-2">
                <p>Total Token Supply</p>
                <div className="flex flex-row items-end space-x-2">
                  <p className="font-extrabold text-[80px] text-custom-primary leading-none align-baseline">
                    {parseInt(props.appState.stats.totalSupply)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* stats */}
          <div className="flex flex-row items-center justify-between w-full px-8 py-2 my-4 rounded-lg bg-custom-primary">
            <p className="text-lg font-bold text-white">Stats</p>
          </div>

          <div className="flex flex-col justify-center w-full">
            {/* Number of Voters Chart */}
            <div className="flex flex-row justify-center p-8 h-[500px]">
              <canvas ref={votersChartRef} />
            </div>

            {/* Total Vote Values Chart */}
            <div className="flex flex-row justify-center p-8 h-[500px]">
              <canvas ref={voteValuesChartRef} />
            </div>

            <div className="flex flex-row justify-center p-8 h-[500px]">
              <canvas ref={dChart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
