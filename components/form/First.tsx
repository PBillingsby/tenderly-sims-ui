import { useState } from "react"
import { Interface } from 'ethers';
import { Button } from "../Button";
import { ArrowRight } from "../icons/ArrowRight";

interface FormData {
  contractAddress: string;
  abiString: string;
}

interface FirstStepProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  formatAbi: (iface: Interface) => void;
}

export const First = ({ setLoading, formatAbi }: FirstStepProps) => {
  const [formData, setFormData] = useState<FormData>({
    contractAddress: '',
    abiString: ''
  })

  const generateOptions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const iface = new Interface(JSON.parse(formData.abiString));
    formatAbi(iface);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form onSubmit={generateOptions} className="p-4 space-y-4 text-white">
      <div className="flex flex-col">
        <label>Contract Address: </label>
        <input
          type="text"
          name="contractAddress"
          value={formData.contractAddress}
          placeholder="0x..."
          onChange={handleInputChange}
          className="text-black bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col">
        <label>ABI: </label>
        <textarea
          name="abiString"
          value={formData.abiString}
          placeholder="[{...}, ..."
          onChange={handleInputChange}
          className="bg-gray-50 text-black border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <Button type="submit">
        <ArrowRight />
      </Button>
    </form>
  )
}
