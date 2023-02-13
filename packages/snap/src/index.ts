import {
  OnRpcRequestHandler,
  OnTransactionHandler,
} from '@metamask/snap-types';

import { isObject } from '@metamask/utils';

const API_KEY = `AYG5PZJS8ITFDX9873NAXKFER7A26WXGM2`;

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

type EtherScanResponse = {
  status: string;
  message: string;
  result: string;
};

/**
 * Fetches etherscan in order to see if contract
 * you are going to be interacting with is verified or not.
 *
 * @param contract - The contract to validate.
 * @returns A message based on the origin.
 */
async function isContractValidated(
  contract: string,
): Promise<EtherScanResponse> {
  const response = await (
    await fetch(
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${contract}&apikey=${API_KEY}`,
      {
        method: 'GET',
        redirect: 'follow',
      },
    )
  ).json();

  return response;
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  console.log('Request:', request, 'Origin:', origin);
  switch (request.method) {
    case 'contractOK':
      return isContractValidated(
        '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413',
      ).then((response) => {
        console.log('Responses:', response);
        return wallet.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: getMessage(origin),
              description: 'Example of how to detect that this contract is OK.',
              textAreaContent: `Contract is ${response.message}`,
            },
          ],
        });
      });
    case 'contractKO':
      return isContractValidated(
        '0xaB9bc244D798123fDe783fCc1C72d3Bb8C189413',
      ).then((response) => {
        console.log('Responses:', response);
        return wallet.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: getMessage(origin),
              description: 'Example of how to detect that this contract is KO.',
              textAreaContent: `Contract is ${response.message}`,
            },
          ],
        });
      });
    default:
      throw new Error('Method not found.');
  }
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  console.log('Transaction:', transaction, 'ChainId:', chainId);
  const insights = {
    insights: { hola: 'mundo' },
  };

  return insights;
};
