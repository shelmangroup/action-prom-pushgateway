const core = require('@actions/core');
const github = require('@actions/github');
const client = require('prom-client');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const pushgatewayAddr = core.getInput('pushgateway')
    console.log(`Got Prometheus Pushgateway address: ${pushgatewayAddr}`)

    let gateway = new client.Pushgateway(pushgatewayAddr);

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
