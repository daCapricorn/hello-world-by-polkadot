const { ApiPromise, WsProvider } = require('@polkadot/api');

async function run() {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  const hash = await api.rpc.chain.getFinalizedHead();
  const body = await api.rpc.chain.getBlock(hash);

  console.info(JSON.stringify(body, null, 2));
}

try {
  run();
} catch (error) {
  console.error(error);
}
