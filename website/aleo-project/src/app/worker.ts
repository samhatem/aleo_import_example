import {
  Account,
  initThreadPool,
  PrivateKey,
  ProgramManager,
} from "@aleohq/sdk";

await initThreadPool();

const hello_hello_program =
    "program hello_hello.aleo;\n" +
    "\n" +
    "function hello:\n" +
    "    input r0 as u32.public;\n" +
    "    input r1 as u32.private;\n" +
    "    add r0 r1 into r2;\n" +
    "    output r2 as u32.private;\n";


const aleo_devrel_take_home_program = "import credits.aleo;\n"+
"program aleo_devrel_take_home.aleo;\n"+


"record token:\n"+
    "owner as address.private;\n"+
    "amount as u64.private;\n"+

"struct data:\n"+
    "v as u32;\n"+

"record message:\n"+
    "owner as address.private;\n"+
    "data as data.private;\n"+


"mapping account:\n"+
	"key as address.public;\n"+
	"value as u64.public;\n"+

"function mint:\n"+
    "input r0 as u64.private;\n"+
    "cast self.caller r0 into r1 as token.record;\n"+
    "output r1 as token.record;\n"+



"function mint_public:\n"+
    "input r0 as u64.private;\n"+
    "async mint_public self.caller r0 into r1;\n"+
    "output r1 as aleo_devrel_take_home.aleo/mint_public.future;\n"+

"finalize mint_public:\n"+
    "input r0 as address.public;\n"+
    "input r1 as u64.public;\n"+
    "set r1 into account[r0];\n"+




"function transfer_credits_to_private:\n"+
    "input r0 as address.private;\n"+
    "input r1 as u64.private;\n"+
    "call credits.aleo/transfer_public_to_private r0 r1 into r2 r3;\n"+
    "async transfer_credits_to_private r3 into r4;\n"+
    "output r2 as credits.aleo/credits.record;\n"+
    "output r4 as aleo_devrel_take_home.aleo/transfer_credits_to_private.future;\n"+

"finalize transfer_credits_to_private:\n"+
    "input r0 as credits.aleo/transfer_public_to_private.future;\n"+
    "await r0;\n"+



"function create_message:\n"+
    "input r0 as u32.private;\n"+
    "cast r0 into r1 as data;\n"+
    "cast self.caller r1 into r2 as message.record;\n"+
    "output r2 as message.record;\n"


async function localProgramExecution() {
  const programManager = new ProgramManager(undefined, undefined, undefined);

  // Create a temporary account for the execution of the program
  const account = new Account();
  programManager.setAccount(account);

  const executionResponse = await programManager.run(
      hello_hello_program,
      "hello",
      ["5u32", "5u32"],
      false,
  );
  return executionResponse.getOutputs();
}

async function mintProgramExecution() {
  const programManager = new ProgramManager(undefined, undefined, undefined);

  // Create a temporary account for the execution of the program
  const account = new Account();
  programManager.setAccount(account);

  const executionResponse = await programManager.run(
      aleo_devrel_take_home_program,
      "mint",
      ["3u64"],
      false,
  );
  return executionResponse.getOutputs();
}


async function mintPublicProgramExecution() {
  const programManager = new ProgramManager(undefined, undefined, undefined);

  // Create a temporary account for the execution of the program
  const account = new Account();
  programManager.setAccount(account);

  const executionResponse = await programManager.run(
      aleo_devrel_take_home_program,
      "mint_public",
      ["8u64"],
      false,
  );
  return executionResponse.getOutputs();
}

async function createMessageProgramExecution() {
  const programManager = new ProgramManager(undefined, undefined, undefined);
  const account = new Account();
  programManager.setAccount(account);

  const executionResponse = await programManager.run(
      aleo_devrel_take_home_program,
      "create_message",
      ["5u32"],
      false,
  );
  return executionResponse.getOutputs();
}

async function transferCreditsProgramExecution() {
  const programManager = new ProgramManager(undefined, undefined, undefined);
  const account = new Account();
  programManager.setAccount(account);

  const executionResponse = await programManager.run(
      aleo_devrel_take_home_program,
      "transfer_credits_to_private",
      ["aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px","10u64"],
      false,
  );
  return executionResponse.getOutputs();
}

function getPrivateKey() {
  return new PrivateKey().to_string();
}

onmessage = async function (e) {
  if (e.data === "execute") {
    const result = await localProgramExecution();
    postMessage({type: "execute", result: result});
  } else if (e.data === "key") {
    const result = getPrivateKey();
    postMessage({type: "key", result: result});
  } else if (e.data ==="mint"){
    const result = await mintProgramExecution();
    postMessage({type: "mint", result: result});
  } else if (e.data ==="mint_public"){
    const result = await mintPublicProgramExecution();
    postMessage({type: "mint_public", result: result});
  } else if (e.data ==="create_message"){
    const result = await createMessageProgramExecution();
    postMessage({type: "create_message", result: result});
  } 
  else if (e.data ==="transfer_credits"){
    const result = await transferCreditsProgramExecution();
    postMessage({type: "transfer_credits", result: result});
  } 
};
