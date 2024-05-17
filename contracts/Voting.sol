// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // Structure to represent a candidate
    struct Candidate {
        string name;
        string gender;
        uint256 age;
        string partyName;
        string electionType;
        uint256 totalVotes;
    }

    // Structure to represent a voter
    struct Voter {
        bool hasVoted;
    }

    // Address of the admin
    address public admin;

    // Mapping to store candidates
    mapping(uint256 => Candidate) public candidates;

    // Mapping to store whether an Aadhar number has voted
    mapping(string => Voter) public voters;

    // Number of candidates
    uint256 public candidatesCount;

    // Variable to track the status of voting
    bool public votingStarted;

    // End time of the voting period
    uint256 public votingEndTime;

    // Event to notify when a vote is cast
    event VoteCasted(string indexed aadharNumber, uint256 candidateId);

    // Modifier to check if the sender is the admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    // Modifier to check if the sender has not voted yet
    modifier notVoted(string memory _aadharNumber) {
        require(!voters[_aadharNumber].hasVoted, "You have already voted.");
        _;
    }

    // Modifier to check if voting has started
    modifier votingIsStarted() {
        require(votingStarted, "Voting has not started yet.");
        _;
    }

    // Modifier to check if voting is still ongoing
    modifier votingIsOngoing() {
        require(
            votingStarted && block.timestamp <= votingEndTime,
            "Voting is not currently ongoing."
        );
        _;
    }

    // Constructor to set the admin
    constructor(address _admin) {
        admin = _admin;
    }

    // Function to add a candidate by the admin
    function addCandidate(
        string memory _name,
        string memory _gender,
        uint256 _age,
        string memory _partyName,
        string memory _electionType
    ) external onlyAdmin {
        candidatesCount++;

        candidates[candidatesCount] = Candidate({
            name: _name,
            gender: _gender,
            age: _age,
            partyName: _partyName,
            electionType: _electionType,
            totalVotes: 0
        });
    }

    // Function to start the voting process and set the end time, accessible only by the admin
    function startVoting(uint256 _votingDuration) external onlyAdmin {
        // Ensure there are registered candidates to vote for
        require(candidatesCount > 0, "No candidates registered for voting.");

        // Set voting started to true
        votingStarted = true;

        // Set the end time of the voting period
        votingEndTime = block.timestamp + _votingDuration;

        // Emit event to signify the start of the voting process
        emit VotingStarted(votingEndTime);
    }

    // Function to cast vote using Aadhar number
    function vote(
        string memory _aadhar,
        uint256 _candidateId
    ) external votingIsStarted votingIsOngoing notVoted(_aadhar) {
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate ID."
        );

        // Mark sender as voted
        voters[_aadhar].hasVoted = true;

        // Increment vote count for the candidate
        candidates[_candidateId].totalVotes++;

        // Emit event
        emit VoteCasted(_aadhar, _candidateId);
    }

    // Function to retrieve all candidates with their IDs
    function getAllCandidates() external view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        for (uint256 i = 1; i <= candidatesCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        return allCandidates;
    }

    // Function to delete a candidate by the admin
    function deleteCandidate(uint256 _candidateId) external onlyAdmin {
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate ID."
        );

        // Shift candidates in the mapping to remove the candidate at _candidateId
        for (uint256 i = _candidateId; i < candidatesCount; i++) {
            candidates[i] = candidates[i + 1];
        }

        // Delete the last candidate (the one that was duplicated in the loop)
        delete candidates[candidatesCount];

        // Decrement candidatesCount
        candidatesCount--;
    }

    // Function to check and update voting status
    function updateVotingStatus() public {
        votingStarted = false;
    }

    // Event to notify when the voting process starts
    event VotingStarted(uint256 endTime);
}
