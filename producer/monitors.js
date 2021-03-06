const crypto = require("crypto");
const monitors = new (require("bull"))("monitors", {
  redis: {
    sentinels: [{ host: process.env.REDIS_HOST, port: 26379 }],
    name: "redis-literoad",
    password: process.env.REDIS_PASSWORD,
    role: "master",
  },
});

exports.create = async (req) => {
  const tenantId = req.body["tenant-id"];
  const monitor = req.body.monitor;

  const monitorId = `${tenantId}~${crypto.randomUUID()}`;

  await monitors.add(
    {
      ...monitor,
      tenant: tenantId,
      id: monitorId,
    },
    {
      jobId: monitorId,
      repeat: {
        cron: `0  ${monitor["hour-zone"]} * * *`,
        tz: "Europe/Moscow",
      },
      attempts: 3,
      removeOnComplete: true,
    }
  );

  // TODO: Have a list of tenant's jobs?

  return monitorId;
};

exports.delete = async (req, res) => {
  const monitorId = req.params.id;

  // FIXME: This digs a bit too deep into the bull's internals.
  // Better way would be to store the initial job configuration
  // when adding it, so we could look up the cron corresponding
  // to the job in our storage.
  const monitorConfigs = await monitors.getRepeatableJobs();
  const job = monitorConfigs.find((job) => job.id === monitorId);

  if (job) {
    await monitors.removeRepeatableByKey(job.key);
  }

  res.code(204);
};
