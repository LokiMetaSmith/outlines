## Archived: 2026-11-02

* The `BadgeNFT` contract is an ERC721 Soulbound token (transfers are disabled) used to reward workers for achievements.
* The `ReputationRegistry` enforces worker eligibility for specific job types using a `minReputationScores` mapping, which is checked via the `checkEligibility` function.
* The project requires `hardhat` version `^2.22.0` (v2 stable) to avoid conflicts with `@nomicfoundation/hardhat-toolbox`.
* The `LazyTaskMarketplace` contract uses a `mapping(bytes32 => bool) activeJobTypesMap` for O(1) job type validation to prevent gas griefing, while retaining `string[] activeJobTypes` for enumeration.
* In `LazyTaskMarketplace`, the `slashBond` function has been replaced by `resolveDispute`. If the worker loses the dispute, their bond is slashed and the original job bounty is refunded to the customer.
* Reputation scores in `ReputationRegistry` are calculated using a `totalRatings` mapping and history length to ensure O(1) gas costs and prevent Denial of Service.
* The `ArbitratorGovernance` contract has a timing issue where `getPastVotes` (used for voting power) excludes the proposer's own voting weight for their proposal in the same block the proposal is created.
* The script `scripts/simulate-dispute-flow.js` simulates multi-agent dispute resolution scenarios (Worker Wins and Worker Loses) by orchestrating interactions between Customer, Worker, Verifier, and Arbitrator roles.
* The `ArbitratorGovernance` contract allows `RewardEngine` token holders to propose and vote on candidates for the `ARBITRATOR_ROLE` in `LazyTaskMarketplace`.
* The `LizardLounge` frontend (`frontend/app/lounge/page.tsx`) reconstructs chat history and table lists by fetching and watching `Message` and `TableCreated` events using `wagmi`.
* The system architecture consists of six main contracts: `LazyTaskMarketplace`, `ReputationRegistry`, `RewardEngine`, `BadgeNFT`, `ArbitratorGovernance`, and `LizardLounge` (social hub).
* The project documentation in `grok/` covers Agentic Payments and OpenClaw integration concepts.
* The script `scripts/deploy-frontend.js` deploys `ReputationRegistry`, `RewardEngine`, `BadgeNFT`, `LazyTaskMarketplace`, and `LizardLounge` to the local network and automatically updates `frontend/config/contracts.ts` with the new addresses and ABIs.
* Frontend smart contract configurations (ABI and addresses) are managed in `frontend/config/contracts.ts`.
* Interfaces `IReputationRegistry` and `IRewardEngine` are defined directly within `LazyTaskMarketplace.sol` rather than in separate files.
* The `LazyTaskMarketplace` contract supports a `submitEvidence(uint256 _jobId, string memory _evidenceHash)` function that emits an `EvidenceSubmitted` event, enabling workers to provide proof of work for accepted jobs.
* The `RewardEngine` contract inherits `ERC20Votes` and `ERC20Permit` to enable on-chain governance, allowing `LAZY` tokens to be used for voting.
* The `LazyTaskMarketplace` contract implements a platform fee (default 500 bps/5%) deducted from bounties, which is reduced based on worker reputation tiers (>=400 score: 2.5%, >=480 score: 0%).
* The `acceptJob` function in `LazyTaskMarketplace` automatically refunds any ETH sent by the worker that exceeds the required `workerBond`.
* The `ReputationRegistry` contract includes `getWorkerHistory(address)` to return job history and `getJobCount(address)` to efficiently return the number of jobs completed by a worker.
* The project includes a `scripts/agent-skills` directory containing scripts (e.g., `postJob.js`, `verifyJob.js`) to simulate AI agent interactions with the smart contracts.
* Documentation for setting up and running the simulated OpenClaw agent is available in `README_OPENCLAW.md`.
* Frontend verification involving wallet interactions is performed by refactoring into pure view components or creating temporary pages with mocked data to bypass complex headless wallet mocking.
* The `ReputationRegistry` contract has a bug in `recordSlash` where it pushes a zero rating but fails to correctly update `totalRatings`, causing `updateScore` to calculate the average using an outdated count.
* The `LazyTaskMarketplace` contract includes `setTreasury(address _treasury)` and `setPlatformFee(uint256 _feeBps)` functions, which are restricted to the `DEFAULT_ADMIN_ROLE` and emit `TreasuryUpdated` and `PlatformFeeUpdated` events.
* The `ReputationRegistry` contract includes a `recordSlash(address _worker, uint256 _jobId)` function that records a job with a 0 rating to negatively impact the worker's reputation score.
* The `JobBoard.tsx` component processes job data as a tuple (`JobTuple`) accessed by index (e.g., `job[6]` for status) rather than as a struct object.
* The `LazyTaskMarketplace` contract utilizes a unified `_finalizeJob` internal function for handling payouts and state updates.
* The script `scripts/mock-openclaw.js` provides an interactive CLI to simulate an OpenClaw AI agent, allowing users to post and verify jobs using deployed contracts found in `deployments.json`.
* Fee calculation logic in `LazyTaskMarketplace` is centralized in an internal `_calculateFee` function to ensure consistency between `completeJob` and `resolveDispute`.
* Installing dependencies in the `frontend/` directory requires running `npm install --legacy-peer-deps` due to peer dependency conflicts between React 19 and Web3 libraries like `connectkit`.
* The frontend is a Next.js application located in `frontend/`, utilizing Wagmi, ConnectKit, and Tailwind CSS for Web3 interaction and styling.
* Merging from the upstream `memeTrusteden26/outlines` requires the `--allow-unrelated-histories` flag due to divergent project histories.
* The upstream repository for pulling changes is `https://github.com/memeTrusteden26/outlines`.
* The `AgentSubscription` contract has a vulnerability where it does not enforce `msg.value == 0` when users pay with ERC20 tokens.
* The deployment script `scripts/deploy.js` explicitly grants `MINTER_ROLE` to the `ReputationRegistry` contract address in `BadgeNFT` to authorize badge minting.
* The `ReputationRegistry` contract includes a `SKILL_REGISTRY_ROLE`, granted to `LizardLounge`, allowing high-reputation agents to register new job types/skills via `announceSkill`.
* The `LazyTaskMarketplace` contract manages dispute resolution via the `ARBITRATOR_ROLE`, allowing assigned addresses to call `resolveDispute`.
* The project 'LazyTask Marketplace' is built using Hardhat and Solidity 0.8.28, utilizing OpenZeppelin contracts.
* Agent wallet management is handled by `scripts/agent-skills/walletManager.js`, which loads `PRIVATE_KEY` from the environment or generates a random wallet for testing.
* When resolving merge conflicts with upstream, the established pattern is to keep local (`HEAD`) configuration files (`hardhat.config.js`, `package.json`), documentation (`todo.md`), and deployment scripts, while accepting upstream (`FETCH_HEAD`) frontend source code (`components/`, `config/`).
* The script `scripts/testnet-e2e.js` automates the full job lifecycle (posting, accepting, verifying) on testnet environments.
* The frontend retrieves user-specific jobs ('My Jobs') by fetching `nextJobId` from the contract and iterating through all job IDs client-side to filter by customer or worker address.
* The `ReputationRegistry` contract triggers `BadgeNFT` mints when a worker reaches job count milestones (1, 5, and 10 jobs).
* The deployment script `scripts/deploy.js` explicitly grants `MARKETPLACE_ROLE` to the `LazyTaskMarketplace` contract address in both `ReputationRegistry` and `RewardEngine` to authorize job recording and reward issuance.
* The `hardhat.config.js` is updated to support `sepolia` and `baseSepolia` networks with `dotenv` for environment variables and Etherscan verification.
* The `LizardLounge` contract facilitates agent social interaction via event-based messaging and managed "Tables", where Table Hosts control membership (approve/kick).
* The `RewardEngine` contract enforces a maximum token supply (`MAX_SUPPLY`) of 1,000,000 tokens, preventing minting beyond this cap.
* The contracts `AgenticOperation.sol`, `AgentSubscription.sol`, and `PerRequestPayment.sol` are present in the local `contracts/` directory.
