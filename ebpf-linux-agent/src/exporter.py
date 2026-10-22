#!/usr/bin/env python3
import time
from bcc import BPF
from prometheus_client import start_http_server, Gauge

PROCESS_EXEC_GAUGE = Gauge(
    'arch_process_executions_total',
    'Total number of process executions recorded by eBPF in kernel space',
    ['process_name']
)

def main():
    print("[*] Compiling and loading eBPF probe into Arch Linux kernel...")
    b = BPF(src_file="agent.c")
    
    start_http_server(8000)
    print("[+] eBPF probe loaded successfully!")
    print("[+] Prometheus metrics endpoint exposed at http://127.0.0.1:8000/metrics")
    print("[*] Capturing real-time kernel execution events... (Press Ctrl+C to stop)")

    counts = b.get_table("exec_counts")

    while True:
        try:
            time.sleep(2)
            for key, val in counts.items():
                # Extract the string from our C struct's 'comm' field
                proc_name = key.comm.decode('utf-8', errors='replace')
                PROCESS_EXEC_GAUGE.labels(process_name=proc_name).set(val.value)
        except KeyboardInterrupt:
            print("\n[-] Detaching eBPF probe and shutting down exporter.")
            break

if __name__ == "__main__":
    main()