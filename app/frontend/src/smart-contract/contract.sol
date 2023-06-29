// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VIDAO is
    ERC20,
    ERC20Burnable,
    Pausable,
    Ownable
{
    struct Option {
        uint256 votes;
        // Add any other properties specific to each option
    }

    struct Proposal {
        mapping(uint256 => Option) options;
        uint256 optionCount;
        uint256 winningOption;
        bool isOpen;
        uint256 totalVotes;
        mapping(address => uint256) votesByUser;
        mapping(uint256 => uint256) totalVotesByOption;
        uint256 totalUsersVoted;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public totalTokenHolders;
    uint256 public totalVotes;
    address[] public tokenHolders;

    constructor() ERC20("VIDAO", "VIDAO") {}

    function createProposal(uint256 _optionCount) public {
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.optionCount = _optionCount;
        newProposal.isOpen = true;
        proposalCount++;
    }

    function vote(uint256 _proposalId, uint256 _optionId) public {
        require(_proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(_optionId < proposal.optionCount, "Invalid option ID");
        require(proposal.isOpen, "Proposal is closed");

        uint256 voterBalance = balanceOf(msg.sender);
        require(voterBalance > 0, "Voter has no tokens to vote");

        Option storage selectedOption = proposal.options[_optionId];
        selectedOption.votes += voterBalance;
        proposal.totalVotes += voterBalance;
        proposal.votesByUser[msg.sender] += voterBalance;
        proposal.totalVotesByOption[_optionId] += voterBalance;

        if (proposal.votesByUser[msg.sender] == voterBalance) {
            proposal.totalUsersVoted++;
        }

        // Update the winning option if necessary
        uint256 currentMaxVotes = proposal
            .options[proposal.winningOption]
            .votes;
        if (selectedOption.votes > currentMaxVotes) {
            proposal.winningOption = _optionId;
        }

        totalVotes += voterBalance;
    }

    function getProposalResult(uint256 _proposalId)
        public
        view
        returns (uint256 winningOption)
    {
        require(_proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        winningOption = proposal.winningOption;
        return winningOption;
    }

    function getProposalOptions(uint256 _proposalId)
        public
        view
        returns (Option[] memory options)
    {
        require(_proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        options = new Option[](proposal.optionCount);
        for (uint256 i = 0; i < proposal.optionCount; i++) {
            options[i] = proposal.options[i];
        }

        return options;
    }

    function getTotalVotesByUser(address _user) public view returns (uint256) {
        uint256 tempTotalVotes = 0;
        for (uint256 i = 0; i < proposalCount; i++) {
            tempTotalVotes += proposals[i].votesByUser[_user];
        }
        return totalVotes;
    }

    function closeProposal(uint256 _proposalId) public onlyOwner {
        require(_proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isOpen, "Proposal is already closed");

        proposal.isOpen = false;
    }

    function getTotalProposalCount() public view returns (uint256) {
        return proposalCount;
    }

    function getTotalTokenHolders() public view returns (uint256) {
        return totalTokenHolders;
    }

    function getTotalVotes() public view returns (uint256) {
        return totalVotes;
    }

    function getTotalVotesByOption(uint256 _proposalId, uint256 _optionId)
        public
        view
        returns (uint256)
    {
        require(_proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(_optionId < proposal.optionCount, "Invalid option ID");

        return proposal.totalVotesByOption[_optionId];
    }

    function getTotalUsersVoted(uint256 _proposalId)
        public
        view
        returns (uint256)
    {
        require(_proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        return proposal.totalUsersVoted;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        totalTokenHolders++;
        tokenHolders.push(to);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);

        if (from != address(0) && to != address(0)) {
            // Remove 'from' address if balance becomes zero after transfer
            if (balanceOf(from) == amount) {
                _removeTokenHolder(from);
            }

            // Add 'to' address if receiving tokens for the first time
            if (balanceOf(to) == 0) {
                _addTokenHolder(to);
            }
        }
    }

    function _addTokenHolder(address holder) internal {
        tokenHolders.push(holder);
        totalTokenHolders++;
    }

    function _removeTokenHolder(address holder) internal {
        for (uint256 i = 0; i < totalTokenHolders; i++) {
            if (tokenHolders[i] == holder) {
                tokenHolders[i] = tokenHolders[totalTokenHolders - 1];
                tokenHolders.pop();
                totalTokenHolders--;
                break;
            }
        }
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20)
    {
        super._mint(to, amount);
        totalTokenHolders++;
        tokenHolders.push(to);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20)
    {
        super._burn(account, amount);
        totalTokenHolders--;
    }

    function getTokenHolders()
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        address[] memory holders = new address[](totalTokenHolders);
        uint256[] memory balances = new uint256[](totalTokenHolders);

        for (uint256 i = 0; i < totalTokenHolders; i++) {
            holders[i] = tokenHolders[i];
            balances[i] = balanceOf(holders[i]);
        }

        return (holders, balances);
    }
}
