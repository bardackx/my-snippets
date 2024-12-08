type Job = {
  start: number;
  end: number;
  cost: number;
};

function intersects(a: Job, b: Job): boolean {
  if (a.end < b.start || b.end < a.start) return false;
  return true;
}

function computeJobs(a: Job, b: Job): Array<Job> {
  let left: Job;
  let right: Job;
  if (a.start < b.start) {
    left = a;
    right = b;
  } else {
    right = a;
    left = b;
  }

  // LLLLLL
  //   RR
  if (left.start <= right.start && right.end <= left.end) {
    const leftBegin: Job = {
      start: left.start,
      end: right.start - 1,
      cost: left.cost,
    };
    const middle: Job = {
      ...right,
      cost: left.cost + right.cost,
    };
    const leftEnd: Job = {
      start: right.end + 1,
      end: left.end,
      cost: left.cost,
    };
    const output = [
      leftBegin,
      middle,
      leftEnd,
    ].filter((e) => e.start <= e.end);
    return output;
  }

  // LLL
  //   RRR
  const leftOnly: Job = {
    start: left.start,
    end: right.start - 1,
    cost: left.cost,
  };
  const middle: Job = {
    start: right.start,
    end: left.end,
    cost: left.cost + right.cost,
  };
  const rightOnly: Job = {
    start: left.end + 1,
    end: right.end,
    cost: right.cost,
  };
  const output = [
    leftOnly,
    middle,
    rightOnly,
  ].filter((e) => e.start <= e.end);
  return output;
}

/**
 * Each day you can either pay the cost per each job in that day OR pay a
 * discountedCost only
 */
function getBestCost(jobs: Array<Job>, discountedCost: number) {
  let processed: Array<Job> = [];
  for (const job of jobs) {
    const draft = processed.filter((e) => intersects(e, job));
    for (const other of draft) {
      processed.splice(processed.indexOf(other), 1);
    }

    const open = [job];
    while (open.length > 0) {
      const current = open.pop()!;

      const other = draft.find((other) => intersects(other, current));
      if (other == null) {
        draft.push(current);
        continue;
      }

      draft.splice(draft.indexOf(other), 1);
      const chunks = computeJobs(current, other);
      for (const chunk of chunks) {
        open.push(chunk);
      }
    }

    for (const job of draft) {
      processed.push(job);
    }
  }

  let total = 0;
  for (const job of processed) {
    const days = job.end - job.start + 1;
    const costPerDay = Math.min(job.cost, discountedCost);
    total += days * costPerDay;
  }

  return total;
}

for (let i = 0; i < 1000; i++) {
  let n = Math.trunc(Math.random() * 100);
  const jobs: Array<Job> = [];
  while (n > 0) {
    const start = Math.trunc(Math.random() * 50);
    const end = start + Math.trunc(Math.random() * 50) + 1;
    const cost = Math.trunc(Math.random() * 50) + 1;
    jobs.push({ start, end, cost });
    n--;
  }
  if (jobs.length === 0) continue;
  const discountedCost = Math.trunc(Math.random() * 20) + 1;

  const total = getBestCost(jobs, discountedCost);

  let totalBruteforce = 0;
  const t0 = jobs.map((e) => e.start).reduce((a, b) => Math.min(a, b));
  const tN = jobs.map((e) => e.end).reduce((a, b) => Math.max(a, b));
  for (let i = t0; i <= tN; i++) {
    const days = 1;
    const jobsCost = jobs
      .filter((e) => e.start <= i && i <= e.end)
      .map((e) => e.cost)
      .reduce((a, b) => a + b, 0);
    const costPerDay = Math.min(jobsCost, discountedCost);
    totalBruteforce += days * costPerDay;
  }

  console.log({ total, totalBruteforce, n: jobs.length });

  if (total !== totalBruteforce) {
    throw new Error(
      "bruteforce is different!! " + total + " vs " + totalBruteforce,
    );
  }
}
