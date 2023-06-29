import React from "react";
import { useNavigate } from "react-router-dom";

import hero from "../assets/svg/hero.svg";
import sone from "../assets/svg/s1.svg";
import stwo from "../assets/svg/s2.svg";
import sthree from "../assets/svg/s3.svg";

function Homepage(props) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mt-8">
        {/* hero container */}
        <div className="flex flex-row items-center space-x-20 justify-center rounded-[50px] bg-custom-secondary p-16 ml-16 mr-16 mb-16   w-fit">
          {/* first column */}
          <div className="flex flex-col items-start space-y-8">
            <div className="flex flex-col">
              <p className="font-bold text-5xl">Empowering Communities</p>
              <p className="font-bold text-5xl">through Decentralized</p>
              <p className="font-bold text-5xl">Governance</p>
            </div>
            <p className="w-[400px] text-lg">
              Shape the Future with Transparent and Inclusive Decision-making.
              Harness the Power of Blockchain to Empower Communities and Drive
              Consensus.
            </p>
          </div>
          {/* second column */}
          <div className="flex flex-col items-end">
            <img src={hero} alt="Hero" className="h-80 w-80" />
          </div>
        </div>

        {/* container one */}
        <div className="flex flex-row items-center  space-x-16 mt-6">
          {/* text */}
          <div className="p-8 bg-custom-secondary rounded-[40px]">
            <p className="w-[450px] text-center">
              Enable transparent and inclusive decision-making processes by
              leveraging blockchain technology. Token holders can actively
              participate in voting, ensuring their voices are heard and
              empowering community-driven governance.
            </p>
          </div>

          {/* logo - text container */}
          <div className="flex flex-col justify-center items-center w-[400px] space-y-4">
            <img src={sone} alt="Hero" className="h-20 w-20" />
            <p className="text-3xl font-bold text-center ">
              Transparent and Inclusive Decision Making
            </p>
          </div>
        </div>

        {/* container two */}
        <div className="flex flex-row items-center  space-x-16 mt-24">
          {/* logo - text container */}
          <div className="flex flex-col justify-center items-center w-[400px] space-y-4">
            <img src={stwo} alt="Hero" className="h-20 w-20" />
            <p className="text-3xl font-bold text-center ">
              Secure and Immutable Voting on the Blockchain
            </p>
          </div>

          {/* text */}
          <div className="p-8 bg-custom-secondary rounded-[40px]">
            <p className="w-[450px] text-center">
              Ensure the integrity and immutability of the voting process with
              blockchain technology. Each vote is recorded on the blockchain,
              providing a secure and tamper-resistant platform that enhances
              trust and confidence in the voting system.
            </p>
          </div>
        </div>

        {/* container three */}
        <div className="flex flex-row items-center  space-x-16 mt-24">
          {/* text */}
          <div className="p-8 bg-custom-secondary rounded-[40px]">
            <p className="w-[450px] text-center">
              Empower communities by utilizing tokenized governance. The
              application grants voting power based on tokens held, allowing
              individuals to actively shape the future of the organization or
              community. Token-based governance ensures a fair and decentralized
              decision-making process.
            </p>
          </div>

          {/* logo - text container */}
          <div className="flex flex-col justify-center items-center w-[400px] space-y-4">
            <img src={sthree} alt="Hero" className="h-20 w-20" />
            <p className="text-3xl font-bold text-center ">
              Empowering Communities through Tokenized Governance
            </p>
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="flex flex-col bg-custom-primary py-20 w-full items-center mt-20 space-y-10">
        <p className="text-3xl font-bold text-white">
          Access Your Descision-Making Authority
        </p>
        <div className="flex flex-col items-center space-y-4">
          <button
            className="btn bg-white btn-lg capitalize text-custom-primary hover:border-2 hover:border-white hover:bg-custom-primary hover:text-white"
            onClick={() => navigate("/signup")}
          >
            Create your Account
          </button>
          <p className="text-white">
            Already have an account? &nbsp;
            <span
              className="text-white font-bold underline hover:cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
