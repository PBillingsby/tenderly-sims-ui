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
    console.log(payloads)
    try {
      const transaction = await tenderlyInstance.simulator.simulateBundle({
        transactions: [payloads],
        blockNumber: 44134585,
      })
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
      <div className="p-4 border text-white space-y-4 min-w-full">
        <p>Function calls</p>
        {Object.keys(options) &&
          <form>
            <select className='flex flex-col text-black' onChange={(e) => setSelectedFunction(e.target.value)}>
              <option value="value" selected>-- select function --</option>

              {Object.entries(options).map(([key, value]) => (
                <option key={key} className="w-full border-2 text-black border-gray-300 rounded-md" value={value?.name}>{value?.name} - {value?.inputs.length} params</option>
              ))}
            </select>
            <div className="flex justify-between pt-10">
              <div>
                {selectedFunction && <Button type="button" onClick={addFunction}><Plus /></Button>}
              </div>
              <Button type="button" onClick={sendTx}><ArrowRight /></Button>
            </div>
          </form>
        }
        {addedFunctions.length > 0 && (
          <div className="flex flex-row gap-12 justify-between">
            <div className="p-4">
              <p>Transaction Parameters</p>
              {Object.keys(currentFunction).length > 0 &&
                <div className="flex">
                  <div className="">
                    <p>{currentFunction.name}</p>
                    <p>{currentFunction.inputs.length} params</p>
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
                      <input onChange={handleInputChange} type="number" step={0.001} id="gas" name="gas" className="w-full border-2 text-black border-gray-300 rounded-md" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="gas_price">Gas Price:</label>
                      <input onChange={handleInputChange} type="string" id="gas_price" name="gas_price" className="w-full border-2 text-black border-gray-300 rounded-md" />
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

                    <Button type="submit">
                      Add
                    </Button>
                  </form>
                </div>
              }
            </div>
          </div>
        )}
        <p>Added Functions</p>
        {payloads.length > 0 && payloads.map((func: TransactionParameters) => {
          console.log("----", func)
          return (
            <div className="flex flex-row justify-between">
              <p>{currentFunction.name}</p>
            </div>
          )
        })
        }
      </div>
    </div>
  )
}