const core = require('@actions/core');
const github = require('@actions/github');
const client = require('prom-client');

function statusValue(input) {
  var change_me = 0;
  if (input === 'success') {
    change_me = 1;
  }
  return change_me
}

async function run() {
  try { 
    const pushgatewayAddr = core.getInput('pushgateway')
    const prefix = 'github_actions';
    const Registry = client.Registry;
    const register = new Registry();
    const gateway = new client.Pushgateway(pushgatewayAddr, [], register);
    const run_id = github.context.runId;
    const job = github.context.job;
    const repo = `github.context.repo: github.com/${github.context.repo.owner}/${github.context.repo.repo}`

    core.info(`Got Prometheus Pushgateway address: ${pushgatewayAddr}`)
    core.info(`github.context.job: ${job}`)
    core.info(`github.context.runId: ${run_id}`)
    core.info(`github.context.repo: ${repo}`)

    const previousstate = core.getInput('previousstate');
    core.info(`previousstate: ${previousstate}`);
    const state_num = statusValue(previousstate)

    const metric_action_gauge = new client.Gauge({
      name: `${prefix}_run`,
      help: `${prefix}_run`,
      registers: [register],
      labelNames: ['repo', 'status', 'runid', `job`],
    });
    register.registerMetric(metric_action_gauge);
    metric_action_gauge.set({
      repo: repo,
      status: previousstate,
      run_id: run_id,
      job: job,
    }, state_num);

    await gateway.push({ jobName: prefix }, (err, resp, body) => {
      core.info(`Error: ${err}`);
      core.info(`Body: ${body}`);
    });

    core.info('mark end');

  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
