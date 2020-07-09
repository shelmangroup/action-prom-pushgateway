const core = require('@actions/core');
const github = require('@actions/github');
const client = require('prom-client');

async function run() {
  try { 
    const pushgatewayAddr = core.getInput('pushgateway')
    const prefix = 'github_actions';
    const Registry = client.Registry;
    const register = new Registry();
    const gateway = new client.Pushgateway(pushgatewayAddr, [], register);
    const repo = github.context.repo.repo;
    const owner = github.context.repo.owner;
    // const run_id = github.context.runId;

    core.info(`Got Prometheus Pushgateway address: ${pushgatewayAddr}`)
    core.info(`github.context.job: ${github.context.job}`)
    core.info(`github.context.runId: ${github.context.runId}`)
    core.info(`github.context.repo: github.com/${owner}/${repo}`)

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

    // octokit testing
    // const token = core.getInput('token');
    // const octokit = github.getOctokit(token);

    // const jobsListWorkflowObj = await octokit.actions.listJobsForWorkflowRun({
    //   owner,
    //   repo,
    //   run_id
    // });

    // const jobsList = JSON.stringify(jobsListWorkflowObj, undefined, 2)
    // core.info(`jobsLit: ${jobsList}`)

    const previousstate = core.getInput('previousstate');
    core.info(`previousstate: ${previousstate}`);


    core.info('mark end')


  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
