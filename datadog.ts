import * as k8s from "@pulumi/kubernetes";

const datadog = new k8s.helm.v3.Release("datadog", {
    chart: "datadog",
    repositoryOpts: { repo: "https://helm.datadoghq.com" },
    namespace: "datadog",
    createNamespace: true,
    values: {
      datadog: {
        apiKey: process.env.DATADOG_API_KEY!,
        clusterName: cluster.eksCluster.name,
        logs: { enabled: true },
        apm: { enabled: true },
      },
    },
  }, { provider: cluster.provider });