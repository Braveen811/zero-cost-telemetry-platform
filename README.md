```markdown
# 🚀 The Zero-Cost Telemetry Platform

[![OS - Arch Linux](https://img.shields.io/badge/OS-Arch_Linux-1793D1?logo=arch-linux&logoColor=white&style=for-the-badge)](https://archlinux.org/)
[![eBPF - BCC](https://img.shields.io/badge/Kernel-eBPF_BCC-black?logo=linux&logoColor=white&style=for-the-badge)](https://ebpf.io/)
[![DevOps - OpenTofu](https://img.shields.io/badge/IaC-OpenTofu-FFD700?logo=terraform&logoColor=black&style=for-the-badge)](https://opentofu.org/)
[![Cloud - LocalStack](https://img.shields.io/badge/Cloud-LocalStack-FFFFFF?logo=amazon-aws&logoColor=000000&style=for-the-badge)](https://localstack.cloud/)
[![Frontend - React Vite](https://img.shields.io/badge/UI-React_Vite-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)

A blazingly fast, end-to-end infrastructure observability pipeline capturing real-time Arch Linux kernel events using eBPF, routed through a time-series database, and visualized on a custom React dashboard—all running locally for $0.

## 🏆 Credits
This architecture is entirely architected and built by **Braveen R** ([@Braveen811](https://github.com/Braveen811)). It was built to solve the FinOps problem of testing complex cloud observability pipelines without spending a single dollar on AWS, proving full-stack "T-shaped" engineering from low-level C code to modern frontend UI.

---

## 📸 Overview
- **Kernel Probe:** eBPF (BCC) / C
- **Database:** Prometheus (Time-series)
- **Cloud Emulator:** LocalStack (AWS S3)
- **Infrastructure as Code:** OpenTofu (Terraform)
- **Frontend UI:** React + Vite + Tailwind CSS + Recharts
- **OS Target:** Arch Linux


```
---

## 🛠️ Step 1: Base Environment Setup
To run this pipeline, you need a Linux machine (preferably Arch) capable of compiling eBPF programs, alongside standard DevOps tooling. Ensure your system is fully updated:

```bash
sudo pacman -Syu

```

## 📦 Step 2: Install Required Dependencies

Before booting the platform, you must install the underlying Linux headers, eBPF compilers, and container engines. Run the following command:

```bash
sudo pacman -S bcc linux-headers python-prometheus_client docker docker-compose npm opentofu

```

*(Note: Ensure your kernel headers perfectly match your active kernel version by checking `uname -r`)*.

---

## 🚀 Step 3: Installation & Deployment

This repository is structured as a monorepo containing three distinct layers.

**1. Clone this repository into your workspace:**

```bash
git clone [https://github.com/Braveen811/zero-cost-telemetry-platform.git](https://github.com/Braveen811/zero-cost-telemetry-platform.git)
cd zero-cost-telemetry-platform

```

**2. Configure LocalStack Auth:**
Edit `docker-compose.yml` and add your free Hobby tier LocalStack Auth Token to the environment variables. You can generate one instantly at [app.localstack.cloud](https://app.localstack.cloud/).

**3. Boot the Cloud Infrastructure & Database:**

```bash
docker compose up -d localstack prometheus

```

**4. Deploy the AWS S3 Bucket via OpenTofu:**

```bash
cd devops-infra
tofu init -upgrade
tofu apply -auto-approve

```

**5. Start the eBPF Kernel Agent (Requires Root):**
Open a **new terminal window**, navigate to the agent source, and run the Python exporter:

```bash
cd ebpf-linux-agent/src
sudo python exporter.py

```

**6. Launch the React Dashboard:**
Open a **third terminal window** to boot the Vite development server:

```bash
cd react-analytics-ui
npm install
npm run dev

```

*(Access the live dashboard at [http://localhost:3000](http://localhost:3000))*

---

## 🔧 Custom Tweaks & Fixes in this Build

This repository includes several specific engineering solutions over standard setups to ensure absolute stability:

### 1. Compiler-Safe eBPF Memory Structs

Standard BCC inline arrays (like `char[TASK_COMM_LEN]`) cause LLVM/Clang compiler crashes on newer Arch Linux kernels.

* **The Fix:** The C probe uses a dedicated `struct key_t` to safely extract and store kernel tracepoint strings from `sys_enter_execve` before pushing them to user-space.

### 2. Zero-CORS Vite Proxying

The frontend needs to query the Prometheus database every 2 seconds without triggering strict browser security blocks.

* **The Fix:** The `vite.config.js` is injected with a seamless API proxy that silently routes frontend `/api/v1/query` requests directly to the Dockerized backend on port 9090.

### 3. Complete AWS Emulation

Instead of paying for Amazon S3, this platform strictly targets the LocalStack emulator.

* **The Fix:** OpenTofu provider configurations are hardcoded to bypass metadata checks, skip credential validation, and route directly to `http://127.0.0.1:4566`.

---

## ⏱️ System Tweaks (Troubleshooting)

**Fix Docker IPv6 Resolution Issues:**
If your LocalStack connection drops or OpenTofu fails to apply, always use `127.0.0.1` instead of `localhost` in your API queries and Terraform endpoints. This prevents local DNS resolution timeouts natively found on Arch Linux IPv6 configurations.

---

## 📊 Dashboard Showcase

*(Replace placeholder with actual image path if uploaded to `react-analytics-ui/src/assets/hero.png`)*

**Featuring:**

* **Real-time Event Tracking:** Total observed executions
* **Active Kernel Hook:** `sys_enter_execve`
* **Cloud Storage Archive:** `s3://telemetry-archive`
* **Visualization:** Dynamic Recharts BarChart of Top 10 Executed Binaries updating every 2000ms.

## !Preview
<img width="1210" height="705" alt="Shot-2026-10-22-152830" src="https://github.com/user-attachments/assets/722130d2-8bfc-4ad0-b867-37ab88fa4c61" />

---

## 📬 Contact

**Braveen R**
- **Let's connect:** [Portfolio & Social Links](https://braveenr.linklee.in/)

---

## ✌️ Wrapping Up

Building a custom cloud-native architecture from scratch is a journey. This repository is my personal take on making low-level Linux observability as seamless, visual, and cost-effective as possible.

Whether you are deploying this exactly as it is, or just stealing the eBPF C code and OpenTofu scripts for your own pipeline—go for it. That's the beauty of open-source engineering.

See you in the terminal!

