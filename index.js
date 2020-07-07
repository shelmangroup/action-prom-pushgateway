const core = require('@actions/core');
const client = require('prom-client');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const pushgatewayAddr = core.getInput('pushgateway')
    console.log(`Got Prometheus Pushgateway address: ${pushgatewayAddr}`)

    let gateway = new client.Pushgateway(pushgatewayAddr);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
