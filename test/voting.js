import { use,expect } from "chai";
import pkg from "hardhat";
import { solidity } from "ethereum-waffle";
const { ethers } = pkg;
const { waffle } = pkg;

use(solidity);

describe("VotingSystem", function () {
    let VotingSystem;
    let votingSystem;
    let admin;
    const aadhar1 = "123456789012"; // Example Aadhar number
    const aadhar2 = "987654321098"; // Example Aadhar number
    const candidate1 = {
        name: "Candidate 1",
        gender: "Male",
        age: 40,
        partyName: "Party A",
        electionType: "General"
    };
    const candidate2 = {
        name: "Candidate 2",
        gender: "Female",
        age: 35,
        partyName: "Party B",
        electionType: "General"
    };

    beforeEach(async function () {
        // Get the first signer account as admin
        [admin] = await ethers.getSigners();

        // Deploy VotingSystem contract with admin as parameter
        VotingSystem = await ethers.getContractFactory("VotingSystem");
        votingSystem = await VotingSystem.deploy(admin.address);
        await votingSystem.deployed();
    });

    it("Admin should be set correctly", async function () {
        expect(await votingSystem.admin()).to.equal(admin.address);
    });

    it("Should add candidate", async function () {
        await votingSystem.addCandidate(candidate1.name, candidate1.gender, candidate1.age, candidate1.partyName, candidate1.electionType);
        const candidates = await votingSystem.getAllCandidates();
        expect(candidates).to.have.lengthOf(1);
        expect(candidates[0].name).to.equal(candidate1.name);
        // Add more assertions for other properties if needed
    });

    it("Should register voter", async function () {
        await votingSystem.registerVoter(aadhar1);
        const voter = await votingSystem.voters(aadhar1);
        expect(voter.isRegistered).to.equal(true);
    });

    it("Should not register already registered voter", async function () {
        await votingSystem.registerVoter(aadhar1);
        await expect(votingSystem.registerVoter(aadhar1)).to.be.revertedWith("Voter is already registered.");
    });

    it("Should cast vote", async function () {
        // Add candidates
        await votingSystem.addCandidate(candidate1.name, candidate1.gender, candidate1.age, candidate1.partyName, candidate1.electionType);
        await votingSystem.addCandidate(candidate2.name, candidate2.gender, candidate2.age, candidate2.partyName, candidate2.electionType);
        // Register voters
        await votingSystem.registerVoter(aadhar1);
        await votingSystem.registerVoter(aadhar2);
        // Start voting
        await votingSystem.startVoting(3600); // 1 hour voting period
        // Cast votes
        await votingSystem.vote(aadhar1, 1);
        await votingSystem.vote(aadhar2, 2);
        // Check vote counts
        const candidate1Data = await votingSystem.candidates(1);
        const candidate2Data = await votingSystem.candidates(2);
        expect(candidate1Data.totalVotes).to.equal(1);
        expect(candidate2Data.totalVotes).to.equal(1);
    });

    it("Should not allow unregistered voter to cast vote", async function () {
        await expect(votingSystem.vote(aadhar1, 1)).to.be.revertedWith("You are not a registered voter.");
    });

    it("Should not allow voter to cast vote twice", async function () {
        // Add candidate
        await votingSystem.addCandidate(candidate1.name, candidate1.gender, candidate1.age, candidate1.partyName, candidate1.electionType);
        // Register voter
        await votingSystem.registerVoter(aadhar1);
        // Start voting
        await votingSystem.startVoting(3600); // 1 hour voting period
        // Cast vote
        await votingSystem.vote(aadhar1, 1);
        // Attempt to cast vote again
        await expect(votingSystem.vote(aadhar1, 1)).to.be.revertedWith("You have already voted.");
    });

    // Add more tests for other functionalities as needed
});
