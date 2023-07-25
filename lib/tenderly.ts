import { Tenderly, Network } from '@tenderly/sdk';

export const tenderlyInstance = new Tenderly({
  accountName: "pbillingsby",
  projectName: "project",
  accessKey: process.env.NEXT_PUBLIC_TENDERLY_ACCESS_KEY || "",
  network: Network.GOERLI
});