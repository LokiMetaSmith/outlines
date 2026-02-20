"use client";

import { useReadContract, useAccount } from "wagmi";
import { LAZY_TASK_MARKETPLACE_ADDRESS, LAZY_TASK_MARKETPLACE_ABI } from "@/config/contracts";
import { formatEther } from "viem";

export function MyJobs() {
  const { address } = useAccount();
  const { data: nextJobId } = useReadContract({
    address: LAZY_TASK_MARKETPLACE_ADDRESS,
    abi: LAZY_TASK_MARKETPLACE_ABI,
    functionName: "nextJobId",
  });

  const jobIds = nextJobId ? Array.from({ length: Number(nextJobId) }, (_, i) => BigInt(i)) : [];

  if (!address) {
    return <p className="text-gray-500">Please connect your wallet to view your jobs.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Jobs I Posted</h2>
        <div className="space-y-4">
          {jobIds.length > 0 ? (
            jobIds.map((id) => (
              <MyJobCard key={Number(id)} jobId={id} userAddress={address} filterType="customer" />
            ))
          ) : (
             <p className="text-gray-500">No jobs found.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Jobs I Accepted</h2>
        <div className="space-y-4">
            {jobIds.length > 0 ? (
              jobIds.map((id) => (
              <MyJobCard key={Number(id)} jobId={id} userAddress={address} filterType="worker" />
            ))
          ) : (
             <p className="text-gray-500">No jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MyJobCard({ jobId, userAddress, filterType }: { jobId: bigint, userAddress: string, filterType: "customer" | "worker" }) {
  const { data: job } = useReadContract({
    address: LAZY_TASK_MARKETPLACE_ADDRESS,
    abi: LAZY_TASK_MARKETPLACE_ABI,
    functionName: "jobs",
    args: [jobId],
  }) as { data: any };

  if (!job) return null;

  // Filter logic
  // job[0] is customer, job[1] is worker
  const isMyJob = filterType === "customer"
    ? job[0].toLowerCase() === userAddress.toLowerCase()
    : job[1].toLowerCase() === userAddress.toLowerCase();

  if (!isMyJob) return null;

  // Status Enum: 0=Posted, 1=Accepted, 2=Completed, 3=Disputed, 4=Rejected
  const statusLabels = ["Posted", "Accepted", "Completed", "Disputed", "Rejected"];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{job[5]}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          job[6] === 0 ? "bg-green-100 text-green-800" :
          job[6] === 1 ? "bg-blue-100 text-blue-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {statusLabels[job[6]]}
        </span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>Bounty: <span className="font-mono text-black dark:text-white">{formatEther(job[2])} ETH</span></p>
        <p>Bond: <span className="font-mono text-black dark:text-white">{formatEther(job[3])} ETH</span></p>
        <p>Job ID: #{jobId.toString()}</p>
        {filterType === "customer" && job[1] !== "0x0000000000000000000000000000000000000000" && (
            <p>Worker: {job[1].slice(0, 6)}...{job[1].slice(-4)}</p>
        )}
        {filterType === "worker" && (
            <p>Customer: {job[0].slice(0, 6)}...{job[0].slice(-4)}</p>
        )}
      </div>
    </div>
  );
}
