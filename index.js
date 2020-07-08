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
    console.log(`github.context.action: ${github.context.action}`)
    console.log(`github.context.job: ${github.context.job}`)
    console.log(`github.context.runId: ${github.context.runId}`)
    console.log(`github.context.repo: ${github.context.repo}`)

    const test = new client.Counter({
      name: `${prefix}_test`,
      help: `${prefix}_test`,
      registers: [register],
    });
    register.registerMetric(test);
    test.inc(10);

    gateway.push({ jobName: prefix }, (err, resp, body) => {
      console.log(`Error: ${err}`);
      console.log(`Body: ${body}`);
    });

    console.log('mark end')

  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
