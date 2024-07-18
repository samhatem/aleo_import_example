"use client";

import styles from "./page.module.css";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [executing, setExecuting] = useState(false);

  const generateAccount = async () => {
    workerRef.current?.postMessage("key");
  };

  async function execute() {
    setExecuting(true);
    workerRef.current?.postMessage("execute");
  }

  async function mint() {
    setExecuting(true);
    workerRef.current?.postMessage("mint");
  }
  async function mintPublic() {
    setExecuting(true);
    workerRef.current?.postMessage("mint_public");
  }
  async function createMessage() {
    setExecuting(true);
    workerRef.current?.postMessage("create_message");
  }
  async function transferCredits() {
    setExecuting(true);
    workerRef.current?.postMessage("transfer_credits");
  }

  const workerRef = useRef<Worker>();

  interface AleoWorkerMessageEvent {
    type: string;
    result: any;
  }

  useEffect(() => {
    workerRef.current = new Worker(new URL("worker.ts", import.meta.url));
    workerRef.current.onmessage = (
      event: MessageEvent<AleoWorkerMessageEvent>
    ) => {
      if (event.data.type === "key") {
        setAccount(event.data.result);
      } else if (event.data.type === "execute") {
        setExecuting(false);
      }
      alert(`WebWorker Response => ${event.data.result}`);
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleWork = useCallback(async () => {
    workerRef.current?.postMessage("execute");
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <p>
          <button onClick={generateAccount}>
            {account
              ? `Account is ${JSON.stringify(account)}`
              : `Click to generate account`}
          </button>
        </p>
        <p>
          <button disabled={executing} onClick={execute}>
            {executing
              ? `Executing...check console for details...`
              : `Execute helloworld.aleo`}
          </button>
        </p>
        <p>
          <button disabled={executing} onClick={mint}>
            {executing
              ? `Minting...check console for details...`
              : `Mint private `}
          </button>
        </p>
        <p>
          <button disabled={executing} onClick={mintPublic}>
            {executing
              ? `Minting Public...check console for details...`
              : `Mint public `}
          </button>
        </p>
        <p>
          <button disabled={executing} onClick={createMessage}>
            {executing
              ? `Creating Message...check console for details...`
              : `Create Message `}
          </button>
        </p>
        <p>
          <button disabled={executing} onClick={transferCredits}>
            {executing
              ? `Transferring Credits...check console for details...`
              : `Transfer Credits `}
          </button>
        </p>
      </div>
    </main>
  );
}
