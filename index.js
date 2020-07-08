const core = require('@actions/core');
const github = require('@actions/github');
const client = require('prom-client');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const pushgatewayAddr = core.getInput('pushgateway')

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

    const prefix = 'github_actions';
    const Registry = client.Registry;
    const register = new Registry();
    const gateway = new client.Pushgateway(pushgatewayAddr, [], register);

    console.log(`Got Prometheus Pushgateway address: ${pushgatewayAddr}`)

    const test = new client.Counter({
      name: `${prefix}_test`,
      help: `${prefix}_test`,
      registers: [register],
    });
    register.registerMetric(test);
    test.inc(10);

    gateway.push({ jobName: prefix }, (err, resp, body) => {
      core.log(`Error: ${err}`);
      core.log(`Body: ${body}`);
    });

    core.log('Dummy data')


  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
