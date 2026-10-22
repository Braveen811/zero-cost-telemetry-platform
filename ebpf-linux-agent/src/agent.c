#include <uapi/linux/ptrace.h>
#include <linux/sched.h>

// Define a struct to hold the process name string safely
struct key_t {
    char comm[TASK_COMM_LEN];
};

// Use the struct as the hash map key
BPF_HASH(exec_counts, struct key_t, u64);

TRACEPOINT_PROBE(syscalls, sys_enter_execve) {
    struct key_t key = {};
    // Safely pull the process name from the kernel into our struct
    bpf_get_current_comm(&key.comm, sizeof(key.comm));

    // Use standard lookup and update methods instead of try_init
    u64 *count = exec_counts.lookup(&key);
    if (count) {
        (*count)++;
    } else {
        u64 initial = 1;
        exec_counts.update(&key, &initial);
    }

    return 0;
}