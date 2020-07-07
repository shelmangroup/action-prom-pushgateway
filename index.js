const core = require('@actions/core');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const pushgatewayAddr = core.getInput('pushgateway')
    console.log(`Got Prometheus Pushgateway address: ${pushgatewayAddr}`)
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
