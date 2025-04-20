import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "../constants";
import { parseEther } from "viem";

import money from '../assets/money.svg'; // Adjust the import path as needed
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddCampaign() {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) return alert("Connect your wallet first.");

    try {
      const timestamp = Math.floor(new Date(form.deadline).getTime() / 1000);
      const targetWei = parseEther(form.target);

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "addCampaign",
        args: [
          address,
          form.title,
          form.description,
          targetWei,
          timestamp,
          form.image,
        ],
      });

      alert("Campaign created successfully!");
      setForm({
        title: "",
        description: "",
        target: "",
        deadline: "",
        image: "",
      });

      navigate('/')
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.shortMessage || err.message));
    }
  };

  return (
    <>
      <div className="bg-[#1c1c24]">

    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isPending && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will get 100% of the raised amount
          </h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="number"
            step="0.01"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="datetime-local"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title={isPending ? "Creating..." : "Submit new campaign"}
            styles="bg-[#1dc071]"
            disabled={isPending}
          />
        </div>
      </form>
    </div>
      </div>
    </>
  );
}