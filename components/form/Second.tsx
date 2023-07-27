import React, { useState } from "react"
import { Button } from "../Button";
import { ArrowRight } from "../icons/ArrowRight";
import { Plus } from "../icons/Plus";
import { FunctionFragment, Interface, ParamType } from "ethers";
import { tenderlyInstance } from "../../lib/tenderly";
import { TransactionParameters, Web3Address } from '@tenderly/sdk';

interface SecondStepProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  options: any,
  abi: Interface
}

export const Second = ({ setLoading, options, abi }: SecondStepProps) => {
  const [formData, setFormData] = useState<TransactionParameters>({
    from: '',
    to: '',
    gas: 0,
    gas_price: '0',
    value: 0,
    input: ''
  })
  const [selectedFunction, setSelectedFunction] = useState<string>("");
  const [addedFunctions, setAddedFunctions] = useState<object[]>([]);
  const [currentFunction, setCurrentFunction] = useState<object>({} as FunctionFragment);
  const [payloads, setPayloads] = useState<TransactionParameters[]>([]);

  const abiInterface = (): Interface => {
    return abi
  }

  const handleFunction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    formData['input'] = abiInterface().encodeFunctionData(currentFunction.name, [])
    setPayloads([...payloads, formData])
    setCurrentFunction({} as FunctionFragment)
    setLoading(false)
  }

  const sendTx = async () => {
    try {
      const transaction = await tenderlyInstance.simulator.simulateTransaction({
        transaction: payloads[0],
        blockNumber: 44134585,
      })
      debugger
    } catch (error) {
      console.log(error)
    }
    debugger
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData)
  };

  const addFunction = () => {
    const addedFunction = options.find((opt: FunctionFragment) => opt.name === selectedFunction)
    setCurrentFunction(addedFunction)
    setAddedFunctions([...addedFunctions, addedFunction])
  }

  console.log("CURRENT PAYLOADS", payloads)

  return (
    <div>
      <div className="functions p-4 border border-red-400 text-white space-y-4 min-w-full">
        <p>Contract Functions</p>
        {Object.keys(options) &&
          <form className="flex pt-10">
            <select className='flex flex-col text-black' onChange={(e) => setSelectedFunction(e.target.value)}>
              <option value="value" selected>-- select function --</option>

              {Object.entries(options).map(([key, value]) => (
                <option key={key} className="w-full border-2 text-black border-gray-300 rounded-md" value={value?.name}>{value?.name}</option>
              ))}
            </select>
            <div className="flex justify-between">
              {selectedFunction &&
                <div className="flex items-center">
                  <Button type="button" onClick={addFunction}><Plus /></Button>
                  <p className="py-8 text-xs">Select Function</p>
                </div>
              }
            </div>
          </form>
        }
        {addedFunctions.length > 0 && (
          <div className="params flex flex-row gap-12 justify-between border border-red-400">
            <div className="p-4 space-y-4 text-white">
              <p>Transaction Parameters</p>
              {Object.keys(currentFunction).length > 0 &&
                <div className="flex">
                  <div className="p-4 space-y-4 text-white">
                    <div className="py-8">
                      <p>Function: {currentFunction.name}</p>
                      <p>{currentFunction.inputs.length === 1 ? "Param: " : "Params: "} {currentFunction.inputs.length}</p>
                    </div>
                    {currentFunction.inputs.length > 0 && currentFunction.inputs.map((input: ParamType) => {
                      debugger
                      return (
                        <div className="flex flex-col">
                          <label htmlFor="from">{input.name}: </label>
                          <input type="text" id="from" name="from" placeholder="0x..." className="w-full border-2 text-black border-gray-300 rounded-md"
                            required />
                        </div>
                      )
                    })}
                  </div>
                  <form onSubmit={handleFunction} className="p-4 space-y-4 text-white">
                    <div className="flex flex-col">
                      <label htmlFor="from">From:</label>
                      <input onChange={handleInputChange} type="text" id="from" name="from" placeholder="0x..." className="w-full border-2 text-black border-gray-300 rounded-md"
                        required />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="to">To:</label>
                      <input onChange={handleInputChange} type="text" id="to" name="to" placeholder="0x..." className="w-full border-2 text-black border-gray-300 rounded-md"
                        required />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="gas">Gas:</label>
                      <input onChange={handleInputChange} type="number" step={0.001} placeholder="0" id="gas" name="gas" className="w-full border-2 text-black border-gray-300 rounded-md" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="gas_price">Gas Price:</label>
                      <input onChange={handleInputChange} type="string" id="gas_price" placeholder="0" name="gas_price" className="w-full border-2 text-black border-gray-300 rounded-md" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="value">Value:</label>
                      <input onChange={handleInputChange} type="number" id="value" name="value" className="w-full border-2 text-black border-gray-300 rounded-md" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="access_list">Access List:</label>
                      <input onChange={handleInputChange} type="text" id="access_list" name="access_list" className="w-full border-2 text-black border-gray-300 rounded-md"
                      />
                    </div>

                    <button type="submit" className="border">
                      Add Function
                    </button>
                  </form>
                </div>
              }
            </div>
          </div>
        )}
        <p>Added Functions</p>
        {addedFunctions.length > 0 && addedFunctions.map((func: TransactionParameters) => {
          return (
            <div className="flex flex-row justify-between">
              <p>{currentFunction.name}</p>
            </div>
          )
        })
        }
      </div>
      <div className="flex items-center justify-between border border-white">
        <p className="py-8 text-xs text-white">Simulate Tx</p>
        <Button type="button" onClick={sendTx}><ArrowRight /></Button>
      </div>
    </div>
  )
}