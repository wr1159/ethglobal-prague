import { useCallProver, useWaitForProvingResult } from "@vlayer/react";
import { pudgyMinterProofAddress } from "./config";
import { pudgyMinterAbi } from "@/src/generated";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export const useProver = () => {
  const [, setProverResult] = useLocalStorage("proverResult", "");
  const {
    callProver,
    data: provingHash,
    error: provingError,
  } = useCallProver({
    address: pudgyMinterProofAddress,
    proverAbi: pudgyMinterAbi,
    functionName: "maxBalanceOf",
    chainId: 11155420,
    gasLimit: 2000000,
  });

  if (provingError) {
    throw new Error(provingError.message);
  }

  const { data: result, error: provingResultError } =
    useWaitForProvingResult(provingHash);

  if (provingResultError) {
    throw new Error(provingResultError.message);
  }

  useEffect(() => {
    if (result && Array.isArray(result)) {
      console.log("result", result);
      setProverResult(
        JSON.stringify(result, (key, value) => {
          if (typeof value === "bigint") {
            return String(value);
          }
          return value as string;
        })
      );
    }
  }, [result]);

  return { callProver, provingHash, result };
};
