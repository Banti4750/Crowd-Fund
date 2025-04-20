import { useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "../constants";
import { formatEther } from "viem";
import { Loader } from "lucide-react";


export default function CampaignTransactions({ campaignId }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: donationData,
    isLoading,
    isError,
    refetch
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getDonators",
    args: [campaignId],
    enabled: isOpen, // Only fetch when panel is open
  });

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refetch(); // Refresh data when opening
    }
  };

  // Process the donation data into a more usable format
  const processTransactions = () => {
    if (!donationData) return [];

    const [donators, donations] = donationData;

    return donators.map((address, index) => ({
      donator: address,
      amount: donations[index],
      id: index
    }));
  };

  const transactions = processTransactions();

  return (
    <div className="bg-[#1c1c24] rounded-[10px] overflow-hidden border border-[#3a3a43]">
      {/* Header/Toggle */}
      <div
        className="bg-[#3a3a43] p-4 cursor-pointer flex justify-between items-center"
        onClick={togglePanel}
      >
        <h3 className="font-epilogue font-semibold text-[16px] text-white">
          Donation History
        </h3>
        <div className="text-white text-xl">
          {isOpen ? '−' : '+'}
        </div>
      </div>

      {/* Transaction List */}
      {isOpen && (
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          ) : isError ? (
            <p className="text-[#ff8a8a] text-center py-4">Failed to load transaction data</p>
          ) : transactions.length === 0 ? (
            <p className="text-[#808191] text-center py-4">No donations yet</p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead className="border-b border-[#3a3a43]">
                  <tr className="text-left">
                    <th className="font-epilogue font-semibold text-[#e4e4e7] p-2">#</th>
                    <th className="font-epilogue font-semibold text-[#e4e4e7] p-2">Donator</th>
                    <th className="font-epilogue font-semibold text-[#e4e4e7] p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[#3a3a43] hover:bg-[#24242e]">
                      <td className="font-epilogue text-[#e4e4e7] p-2">{tx.id + 1}</td>
                      <td className="font-epilogue text-[#e4e4e7] p-2 truncate">
                        {tx.donator}
                      </td>
                      <td className="font-epilogue text-[#e4e4e7] p-2">{formatEther(tx.amount)} ETH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}