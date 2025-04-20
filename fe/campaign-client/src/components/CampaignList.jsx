import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "../constants";
import { formatEther, parseEther } from "viem";
import CampaignTransactions from './CampaignTransactions';
import { Loader } from "lucide-react";
import CustomButton from "./CustomButton";

export default function CampaignList() {
    const [donatingCampaignId, setDonatingCampaignId] = useState(null);

  const { address } = useAccount();
  const [donationAmounts, setDonationAmounts] = useState({});
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const {
    data: campaigns,
    isLoading,
    isError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getCampaigns",
    watch: true,
  });

  const { writeContractAsync, isPending } = useWriteContract();

  const handleDonationChange = (campaignId, value) => {
    setDonationAmounts({
      ...donationAmounts,
      [campaignId]: value
    });
  };

  const handleDonate = async (id) => {
    if (!address) {
      alert("Connect your wallet to donate.");
      return;
    }

    const amount = donationAmounts[id] || "0.1";

    try {
      setDonatingCampaignId(id); // <-- Only this campaign is processing

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "donateToCampaign",
        args: [id],
        value: parseEther(amount),
      });

      alert(`Thanks for your donation of ${amount} ETH!`);

      const updatedAmounts = { ...donationAmounts };
      delete updatedAmounts[id];
      setDonationAmounts(updatedAmounts);
    } catch (err) {
      console.error("Donation failed:", err);
      alert("Transaction failed: " + (err.shortMessage || err.message));
    } finally {
      setDonatingCampaignId(null); // <-- Reset after done
    }
  };


  const toggleCampaignDetails = (idx) => {
    setExpandedCampaign(expandedCampaign === idx ? null : idx);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-10">
      <Loader/>
    </div>
  );

  if (isError || !campaigns) return (
    <div className="bg-[#1c1c24] text-white text-center py-10 rounded-[10px]">
      Failed to load campaigns.
    </div>
  );

  return (
    <div className="bg-[#1c1c24] flex flex-col rounded-[10px] sm:p-10 p-4 mx-12">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          All Campaigns
        </h1>
      </div>

      {address && (
        <div className="mt-[20px] font-epilogue font-normal text-[16px] text-[#808191]">
          Your address: <span className="text-white">{address}</span>
        </div>
      )}

      {campaigns.length === 0 && (
        <p className="font-epilogue font-semibold text-[16px] leading-[30px] text-white text-center mt-[20px]">
          No campaigns found.
        </p>
      )}

      <div className="flex flex-col mt-[20px] gap-[30px]">
        {campaigns.map((campaign, idx) => (
          <div
            key={idx}
            className="w-full rounded-[15px] bg-[#1c1c24] border border-[#3a3a43] hover:shadow-lg hover:border-[#4acd8d] transition-all overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image column */}
              <div className="md:w-1/3">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-[200px] object-cover md:h-full"
                />
              </div>

              {/* Content column */}
              <div className="md:w-2/3 p-6">
                <div className="block mb-4">
                  <h3 className="font-epilogue font-semibold text-[20px] text-white text-left leading-[26px]">
                    {campaign.title}
                  </h3>
                  <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left">
                    {campaign.description}
                  </p>
                </div>

                <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                  <div className="flex flex-col">
                    <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                      {formatEther(campaign.amountCollected)} ETH
                    </h4>
                    <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
                      Raised of {formatEther(campaign.target)} ETH
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                      {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}
                    </h4>
                    <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
                      Deadline
                    </p>
                  </div>
                </div>

                <div className="mt-[15px]">
                  <p className="font-epilogue font-normal text-[12px] text-[#808191]">
                    Owner: <span className="text-[#b2b3bd]">{campaign.owner}</span>
                  </p>
                </div>

                <div className="mt-[20px] flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="ETH Amount"
                      value={donationAmounts[idx] || ""}
                      onChange={(e) => handleDonationChange(idx, e.target.value)}
                      className="w-full bg-[#13131a] px-4 py-3 outline-none border border-[#3a3a43] rounded-[10px] text-white"
                    />
                  </div>

                  <CustomButton
                    btnType="button"
                    title={donatingCampaignId === idx ? "Processing..." : "Donate"}
                    styles="bg-[#8c6dfd] px-6"
                    handleClick={() => handleDonate(idx)}
                    disabled={donatingCampaignId === idx}
                    />


                  <CustomButton
                    btnType="button"
                    title={`${expandedCampaign === idx ? 'Hide' : 'Show'} Transactions`}
                    styles="bg-[#3a3a43]"
                    handleClick={() => toggleCampaignDetails(idx)}
                  />
                </div>
              </div>
            </div>

            {/* Transaction history panel */}
            {expandedCampaign === idx && (
              <div className="border-t mt-8 border-[#3a3a43]">
                <CampaignTransactions campaignId={idx} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}