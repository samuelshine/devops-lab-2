# DevOps Lab 2 — Basic CI Workflow with GitHub Actions

**Aim:** Design and implement a basic CI workflow triggered by commits, using GitHub Actions.

A small Node.js project serves as the subject under test. Every commit pushed to the
repository automatically kicks off a pipeline that lints the code, runs the unit tests
on three Node versions, builds an artifact, and publishes a summary.

---

## 1. Project structure

```
lab-2/
├── .github/
│   └── workflows/
│       └── ci.yml            # the CI pipeline definition
├── src/
│   ├── calculator.js         # arithmetic helpers
│   ├── validator.js          # email / password / username validation
│   └── index.js              # demo entry point
├── test/
│   ├── calculator.test.js    # 6 tests
│   └── validator.test.js     # 4 tests
├── scripts/
│   └── build.js              # produces dist/ + a build manifest
├── eslint.config.js          # lint rules (ESLint 9 flat config)
├── package.json
└── README.md
```

## 2. Running it locally

```bash
npm ci          # install exactly what package-lock.json pins
npm run lint    # ESLint static analysis
npm test        # Node's built-in test runner
npm run build   # emit dist/
npm start       # run the demo
```

## 3. The CI workflow

The pipeline lives in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### Triggers

| Event | When it fires |
| ----- | ------------- |
| `push` | Any commit pushed to `main`, `develop`, or a `feature/**` branch |
| `pull_request` | Any PR opened or updated against `main` |
| `workflow_dispatch` | Manual run from the **Actions** tab |

A `concurrency` group cancels an in-progress run when a newer commit lands on the
same branch, so the runner is not wasted on stale code.

### Jobs

```
        ┌──────────┐
        │   Lint   │──┐
        └──────────┘  │
                      ├──▶  ┌─────────┐    ┌─────────┐
  ┌────────────────┐  │     │  Build  │───▶│ Summary │
  │ Test (Node 20) │  │     └─────────┘    └─────────┘
  │ Test (Node 22) │──┘
  │ Test (Node 24) │
  └────────────────┘
```

| Job | What it does | Depends on |
| --- | ------------ | ---------- |
| **Lint** | `npm ci` then `npm run lint` — catches style and correctness issues before tests run | — |
| **Test** | Runs the 10 unit tests across a **matrix** of Node 20, 22 and 24 in parallel | — |
| **Build** | Runs `npm run build` and uploads `dist/` as a downloadable artifact | `lint`, `test` |
| **Summary** | Writes a results table to the GitHub job summary and fails the run if any stage failed | all three |

`Lint` and `Test` have no dependencies, so they start at the same time. `Build` is
gated behind both via `needs:`, which means **no artifact is ever produced from code
that failed review**. `Summary` uses `if: always()` so it reports even when an
earlier stage fails.

### Concepts the workflow demonstrates

- **Event-driven triggers** — `on: push` is what makes this "CI triggered by commits".
- **Job dependencies** (`needs:`) — enforcing a sequence where it matters, parallel where it doesn't.
- **Build matrix** — one job definition, three Node versions, run concurrently.
- **Dependency caching** (`cache: npm`) — restores `~/.npm` between runs to cut install time.
- **Artifacts** (`actions/upload-artifact`) — passing build output out of the ephemeral runner.
- **Least-privilege permissions** — `contents: read` only.
- **Fail-fast feedback** — `fail-fast: false` on the matrix so one Node version failing still shows the results for the others.

## 4. Observing a run

1. Push a commit:
   ```bash
   git commit -am "Update calculator"
   git push
   ```
2. Open the repository on GitHub → **Actions** tab.
3. The run appears immediately, titled after the commit message.
4. Click into it to see the job graph, per-step logs, the summary table, and the
   `dist-<sha>` artifact attached to the run.

## 5. Verifying the pipeline actually catches problems

To confirm the CI is doing real work rather than always passing green, break
something on a branch and watch it fail:

```bash
git checkout -b feature/break-ci
# change `assert.equal(add(2, 3), 5)` to `assert.equal(add(2, 3), 6)`
git commit -am "Intentionally break a test"
git push -u origin feature/break-ci
```

The `Test` job goes red, `Build` is skipped because its `needs:` are unmet, and
`Summary` reports the failure.

## 6. Result

A commit-triggered CI pipeline that gives automated feedback on every push, blocks
a build from being produced from failing code, and verifies the project against
multiple runtime versions.
