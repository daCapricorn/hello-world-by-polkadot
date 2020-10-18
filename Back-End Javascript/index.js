const { ApiPromise, WsProvider } = require('@polkadot/api');
const prompts = require('prompts');
const ora = require('ora');

async function exec(hash) {
  const spinner = ora(!hash ? 'Fetching latest block info' : `Fetching block info #${hash}`);
  spinner.start();

  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  if (!hash) {
    hash = await api.rpc.chain.getFinalizedHead();
  }

  const body = await api.rpc.chain.getBlock(hash);

  spinner.succeed(JSON.stringify(body, null, 2));

  return true;
}

function questions() {
  return [{
    type: prev => prev === false ? null : 'text',
    name: 'hash',
    message: 'Get block info via hash (default: latest)',
    initial: '',
  }];
}

async function run() {
  let response = await prompts(questions());
  await exec(response.hash);

  while (true) {
    const askContinue = {
      type: 'toggle',
      name: 'continue',
      message: 'Next step:',
      initial: false,
      active: 'continue',
      inactive: 'exit',
    };

    response = await prompts([askContinue, ...questions()]);

    if (!response.continue) {
      return 0;
    }

    await exec(response.hash);
  }
}

try {
  run().then(() => process.exit(0));
} catch (error) {
  console.error(error);
}
