```markdown
# Zero-Cost Cloud-Native Telemetry Platform

An end-to-end infrastructure observability pipeline that captures real-time Linux kernel process executions, routes telemetry through a local time-series database, and visualizes the data via a custom React dashboard—all while emulating cloud infrastructure locally at zero cost.

## Overview
This project bridges low-level Linux kernel programming with modern cloud and web technologies. It uses an **eBPF (Extended Berkeley Packet Filter)** probe to monitor system events, exports metrics to **Prometheus**, and visualizes them on a sleek **React (Vite + Tailwind CSS)** dashboard. To emulate a production cloud environment without incurring AWS charges, the project uses **LocalStack** orchestrated by **OpenTofu (Terraform)** to provision an S3 archive bucket.

## Motivation
Cloud computing costs (FinOps) and full-stack observability are two of the most critical challenges in modern software engineering. I built this platform to solve the problem of testing complex DevOps architectures without spending a single dollar. It was inspired by the desire to demonstrate "T-shaped" development skills—proving I can write C code for the Linux kernel, provision cloud infrastructure as code, and design a polished frontend UI within a single cohesive monorepo.

## Uses and Use Cases
- **Kernel-Level Monitoring:** Security and system administrators can track exactly which binaries are executed on a Linux machine in real-time (e.g., detecting unauthorized scripts or processes).
- **FinOps Cloud Testing:** Developers can safely test AWS S3 provisioning and API interactions locally using LocalStack before deploying to costly cloud environments.
- **Observability Pipelines:** Serves as a foundational template for routing high-throughput system data into a Prometheus engine for analytics.

## Installation and Setup

### Prerequisites
- **Arch Linux** (with `linux-headers` installed for eBPF compilation)
- Docker & Docker Compose
- OpenTofu (Terraform alternative)
- Node.js & npm
- Python 3 with `bcc` and `prometheus_client` packages

### Configuration Steps

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/Braveen811/zero-cost-telemetry-platform.git](https://github.com/Braveen811/zero-cost-telemetry-platform.git)
   cd zero-cost-telemetry-platform

```

2. **Configure LocalStack:**
Update the `docker-compose.yml` file with your free LocalStack Auth Token. You can generate a free Hobby tier token at [app.localstack.cloud](https://app.localstack.cloud/).
3. **Boot the Cloud & Database:**
```bash
docker compose up -d localstack prometheus

```


4. **Deploy Infrastructure:**
```bash
cd devops-infra
tofu init -upgrade
tofu apply -auto-approve

```


5. **Start the Kernel Agent (Requires Root):**
```bash
cd ../ebpf-linux-agent/src
sudo python exporter.py

```


6. **Launch the Dashboard:**
Open a new terminal window to start the frontend.
```bash
cd ../react-analytics-ui
npm install
npm run dev

```



### Troubleshooting

* **eBPF Compilation Errors:** Ensure your Arch Linux kernel headers perfectly match your active kernel (`uname -r`).
* **LocalStack Connection Issues:** Use `127.0.0.1` instead of `localhost` in your API queries to prevent IPv6 resolution failures.
* **Docker Start Limit Hit:** If Docker fails to start on Arch Linux after a system update, reboot the machine to apply the new networking modules.

## What I Learned

Building this project pushed me deep into the internals of Linux and container networking. The biggest technical challenge was handling BCC's `BPF_HASH` macros in C; passing inline arrays caused LLVM/Clang compiler errors. I solved this by explicitly defining a C `struct` to safely extract and store the `TASK_COMM_LEN` strings from the kernel's `sys_enter_execve` tracepoint. I also learned how to seamlessly proxy Vite API requests to prevent CORS errors when connecting the frontend to the Prometheus engine.

## Personal Interest

I am highly passionate about the intersection of low-level system architecture and high-level software design. There is something deeply satisfying about watching a command executed in an Arch Linux terminal instantly trigger a data flow that travels through the kernel, into a Dockerized database, and dynamically updates a React UI chart milliseconds later.

## Future Directions

* Migrate the LocalStack S3 bucket from a static provision to actively archiving hourly telemetry JSON dumps via an AWS Lambda emulation.
* Introduce Grafana alongside the custom React UI for advanced historical data querying.

## License & Contributing

This project is open-source under the MIT License. Contributions, issues, and feature requests are welcome!

## Contact

**Braveen R**

* [Linklee Hub](https://braveenr.linklee.in/)

```

```