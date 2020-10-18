const { ApiPromise, WsProvider } = require('@polkadot/api');
const ora = require('ora');

async function run() {
  const spinner = ora('');
  spinner.start();

  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  const hash = await api.rpc.chain.getFinalizedHead();
  spinner.text = `Fetching block info #${hash} …`;
  const body = await api.rpc.chain.getBlock(hash);

  spinner.succeed(JSON.stringify(body, null, 2));
}

try {
  run();
} catch (error) {
  console.error(error);
}
