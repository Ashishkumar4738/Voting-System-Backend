async function main() {
  const [admin] = await ethers.getSigners();

  const Voting = await ethers.getContractFactory("VotingSystem");
  const voting = await Voting.deploy(admin.address);
  console.log("Token address: ", voting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
