const core = require('@actions/core');
const github = require('@actions/github');
const client = require('prom-client');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const pushgatewayAddr = core.getInput('pushgateway')

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    core.info(`The event payload: ${payload}`);

    const prefix = 'github_actions';
    const Registry = client.Registry;
    const register = new Registry();
    const gateway = new client.Pushgateway(pushgatewayAddr, [], register);

    core.info(`Got Prometheus Pushgateway address: ${pushgatewayAddr}`)
    core.info(`github.context.action: ${github.context.action}`)
    core.info(`github.context.job: ${github.context.job}`)
    core.info(`github.context.runId: ${github.context.runId}`)
    core.info(`github.context.repo: github.com/${github.context.repo.owner}/${github.context.repo.repo}`)

    const test = new client.Counter({
      name: `${prefix}_test`,
      help: `${prefix}_test`,
      registers: [register],
    });
    register.registerMetric(test);
    test.inc(10);

    await gateway.push({ jobName: prefix }, (err, resp, body) => {
      core.info(`Error: ${err}`);
      core.info(`Body: ${body}`);
    });

    core.info('mark end')

  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
