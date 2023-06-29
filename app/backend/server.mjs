import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion } from "mongodb";
import cors from "cors";
import chalk from "chalk";

// const uri = "mongodb://127.0.0.1:27017/";
const uri =
  "mongodb+srv://manuareraa:SLgAdQQorrHDEOVs@cluster0.6vwnvlh.mongodb.net/";
const database = "governex";
const app = express();
const port = process.env.PORT || 5454;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const printInfo = (message) => {
  console.log(chalk.black.bgGreen.bold("[INFO]") + " " + message);
};

const printError = (message, error) => {
  console.log(chalk.black.bgRed.bold("[ERROR]") + " " + message);
  console.log(error);
};

const printFunctionCall = (functionName) => {
  console.log(
    chalk.black.bgYellow.bold(`[FUNCTION CALL]`) +
      " " +
      chalk.cyan.bgMagenta.bold(`[${functionName}]`)
  );
};

const printParameters = (parameters) => {
  console.log(chalk.magenta.bold("======================================"));
  console.log(chalk.magenta.bold("Parameters:"));
  console.log(parameters);
  console.log(chalk.magenta.bold("======================================"));
};

async function connectToMongoDB() {
  printInfo("Establishing connection to MongoDB Atlas...");
  try {
    await client.connect();
    printInfo("Connected to MongoDB Atlas");
  } catch (e) {
    printError("Error connecting to MongoDB Atlas", e);
  }
}

app.listen(port, async () => {
  await connectToMongoDB();
  printInfo(`Server listening on port ${port}`);
});

app.get("/", async (req, res) => {
  printFunctionCall("/");
  res.send("API/Backend is working!!");
});

app.post("/signup", async (req, res) => {
  printFunctionCall("signup");
  printParameters(req.body);
  const db = client.db(database);
  const collection = db.collection("users");
  const user = {
    walletAddress: req.body.walletAddress,
    name: req.body.name,
    id: req.body.id,
  };

  try {
    const userFound = await collection.findOne({
      walletAddress: user.walletAddress,
    });
    if (userFound) {
      res
        .status(400)
        .send({ success: false, message: "Account already exists" });
    } else {
      await collection.insertOne(user);
      res.status(200).send({ success: true, user: user });
    }
  } catch (e) {
    res.status(400).send({ success: false, message: "Error signing up" });
  }
});

app.post("/signin", async (req, res) => {
  printFunctionCall("signin");
  printParameters(req.body);
  const db = client.db(database);
  const collection = db.collection("users");
  const user = {
    walletAddress: req.body.walletAddress,
  };

  try {
    const userFound = await collection.findOne({
      walletAddress: user.walletAddress,
    });
    if (userFound) {
      res.status(200).send({ success: true, user: userFound });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Account does not exist" });
    }
  } catch (e) {
    res.status(400).send({ success: false, message: "Error signing in" });
  }
});

app.post("/createProposal", async (req, res) => {
  printFunctionCall("createProposal");
  printParameters(req.body);
  const db = client.db(database);
  const collection = db.collection("proposals");
  let optionObject = {};

  req.body.options.forEach((option, index) => {
    optionObject = {
      ...optionObject,
      [index]: {
        option: option,
        votes: 0,
        voters: 0,
      },
    };
  });

  const proposal = {
    id: req.body.id,
    question: req.body.question,
    options: optionObject,
    status: "open",
    votes: 0,
    voters: 0,
    timestamp: req.body.timestamp,
    txnHash: req.body.txnHash,
    rawTimestamp: req.body.rawTimestamp,
    votedProposalIDs: [],
  };

  try {
    const proposalFound = await collection.findOne({ id: proposal.id });
    if (proposalFound) {
      res
        .status(400)
        .send({ success: false, message: "Proposal already exists" });
    } else {
      await collection.insertOne(proposal);
      res.status(200).send({ success: true, proposal: proposal });
    }
  } catch (e) {
    res
      .status(400)
      .send({ success: false, message: "Error creating proposal" });
  }
});

app.get("/getAllProposals", async (req, res) => {
  printFunctionCall("getAllProposals");
  const db = client.db(database);
  const collection = db.collection("proposals");

  try {
    const proposals = await collection.find({}).toArray();
    res.status(200).send({ success: true, proposals: proposals });
  } catch (e) {
    res
      .status(400)
      .send({ success: false, message: "Error getting proposals" });
  }
});

app.post("/save-txn", async (req, res) => {
  printFunctionCall("save-txn");
  printParameters(req.body);
  const db = client.db(database);
  const collection = db.collection("transactions");
  const transaction = {
    sender: req.body.sender,
    receiver: req.body.receiver,
    amount: req.body.amount,
    timestamp: req.body.timestamp,
    txnHash: req.body.txnHash,
    txnType: req.body.txnType,
    rawTimestamp: req.body.rawTimestamp,
  };

  try {
    await collection.insertOne(transaction);
    res.status(200).send({ success: true, transaction: transaction });
  } catch (e) {
    res.status(400).send({ success: false, message: "Error saving txn" });
  }
});

app.get("/get-total-vote-count", async (req, res) => {
  printFunctionCall("get-total-vote-count");
  const db = client.db(database);
  const collection = db.collection("proposals");

  try {
    const proposals = await collection.find({}).toArray();
    let totalVoteCount = 0;
    proposals.forEach((proposal) => {
      totalVoteCount += parseInt(proposal.votes);
    });
    res.status(200).send({ success: true, totalVoteCount: totalVoteCount });
  } catch (e) {
    res
      .status(400)
      .send({ success: false, message: "Error getting total vote count" });
  }
});

app.get("/get-total-open-vote-count", async (req, res) => {
  printFunctionCall("get-total-open-vote-count");
  const db = client.db(database);
  const collection = db.collection("proposals");

  try {
    const proposals = await collection.find({}).toArray();

    let totalVoteCount = 0;
    const promises = proposals.map(async (proposal) => {
      if (proposal.status === "open") {
        totalVoteCount += 1;
      }
      return totalVoteCount;
    });

    const openVotes = await Promise.all(promises);

    res.status(200).send({ success: true, totalOpenVoteCount: totalVoteCount });
  } catch (e) {
    res
      .status(400)
      .send({ success: false, message: "Error getting total open vote count" });
  }
});

app.post("/vote", async (req, res) => {
  printFunctionCall("vote");
  printParameters(req.body);
  const db = client.db(database);
  const collection = db.collection("proposals");
  const transactionCollection = db.collection("votes");
  const userProfile = db.collection("users");

  const vote = {
    voter: req.body.voter,
    voteValue: req.body.voteValue,
    voteId: req.body.voteId,
    optionId: req.body.optionId,
    timestamp: req.body.timestamp,
    txnHash: req.body.txnHash,
    txnType: req.body.txnType,
    rawTimestamp: req.body.rawTimestamp,
  };

  try {
    const userFound = await userProfile.findOne({ walletAddress: vote.voter });
    if (userFound) {
      userFound.votedProposalIDs.push(vote.voteId);
      userFound.voteValue =
        parseInt(userFound.voteValue) + parseInt(vote.voteValue);
      userFound.vote = parseInt(userFound.vote) + 1;
    } else {
      console.log("User not found");
    }

    const updatedUser = await userProfile.updateOne(
      { walletAddress: vote.voter },
      { $set: userFound }
    );

    const proposalFound = await collection.findOne({ id: vote.voteId });
    if (proposalFound) {
      const option = proposalFound.options[vote.optionId];
      const updatedOption = {
        ...option,
        voters: option.voters + 1,
        votes: option.votes + vote.voteValue,
      };
      const updatedOptions = {
        ...proposalFound.options,
        [vote.optionId]: updatedOption,
      };
      const updatedProposal = {
        ...proposalFound,
        options: updatedOptions,
        votes: proposalFound.votes + vote.voteValue,
        voters: proposalFound.voters + 1,
      };
      await collection.updateOne(
        { id: vote.voteId },
        { $set: updatedProposal }
      );
      await transactionCollection.insertOne(vote);
      res.status(200).send({ success: true, vote: vote });
    } else {
      res.status(400).send({ success: false, message: "Proposal not found" });
    }
  } catch (e) {
    res.status(400).send({ success: false, message: "Error voting" });
  }
});

app.get("/get-all-txns-by-address/:address", async (req, res) => {
  printFunctionCall("get-all-txns-by-address");
  const db = client.db(database);
  const collection = db.collection("votes");

  try {
    const transactions = await collection
      .find({ voter: req.params.address })
      .toArray();
    res.status(200).send({ success: true, transactions: transactions });
  } catch (e) {
    res
      .status(400)
      .send({ success: false, message: "Error getting transactions" });
  }
});

app.post("/close-proposal", async (req, res) => {
  printFunctionCall("close-proposal");
  printParameters(req.body);
  const db = client.db(database);
  const collection = db.collection("proposals");

  try {
    const proposalFound = await collection.findOne({
      id: parseInt(req.body.proposalId),
    });
    if (proposalFound) {
      proposalFound.status = "closed";
      await collection.updateOne(
        { id: parseInt(req.body.proposalId) },
        { $set: proposalFound }
      );
      res.status(200).send({ success: true, proposal: proposalFound });
    } else {
      res.status(400).send({ success: false, message: "Proposal not found" });
    }
  } catch (e) {}
});

app.post("/get-user-profile", async (req, res) => {
  printFunctionCall("get-user-profile");
  printParameters(req.body);
  const db = client.db(database);
  const collection = db.collection("users");
  const user = {
    walletAddress: req.body.walletAddress,
  };

  try {
    const userFound = await collection.findOne({
      walletAddress: user.walletAddress,
    });
    if (userFound) {
      res.status(200).send({ success: true, user: userFound });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Account does not exist" });
    }
  } catch (e) {
    res.status(400).send({ success: false, message: "Error signing in" });
  }
});


