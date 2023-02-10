import { defaultSnapOrigin } from '../config';

export const sendContractOK = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'contractOK',
      },
    ],
  });
};

export const sendContractKO = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'contractKO',
      },
    ],
  });
};
