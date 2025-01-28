import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";

// Create EKS cluster
const cluster = new eks.Cluster("demo-cluster-dev", {
  version: "1.28",
  instanceType: "t3.medium",
  desiredCapacity: 1,
  minSize: 1,
  maxSize: 3,
  autoMode: {
    enabled: true,
  }
});

// Install ArgoCD
const argoCd = new k8s.helm.v3.Release("argocd", {
  chart: "argo-cd",
  repositoryOpts: { repo: "https://argoproj.github.io/argo-helm" },
  namespace: "argocd",
  createNamespace: true,
  values: { server: { service: { type: "LoadBalancer" } } },
}, { provider: cluster.provider });

// Export ArgoCD server URL
export const argoCdUrl = cluster.core.services
  .find(svc => svc.metadata.name === "argocd-server")
  .status.loadBalancer.ingress[0].hostname;