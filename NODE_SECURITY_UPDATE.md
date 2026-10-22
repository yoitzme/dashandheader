# Node.js security update candidate

Prepared October 22, 2026. No production merge, server runtime update or deployment is claimed.

The official October 21 security releases include Node 22.23.4, 24.22.1 and 26.12.1. This repository selects the supported LTS patch 24.22.1. Node 20 is end-of-life. See [the Node advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) and [release schedule](https://github.com/nodejs/Release/blob/main/schedule.json).

The runtime check rejects unsupported/unpatched versions, checks support end dates, and compares against the latest official LTS patch. Build scripts run it before building. Eleven boundary tests pass. Existing Node workflows and applicable Docker bases are updated; new GitHub Actions are pinned to verified official commit SHAs. The live host may still run an older patch until rebuilt/restarted and verified.

## Dependency audit results

Counts below are npm dependency-graph findings, not unique exploits or evidence of compromise. "Production" means `npm audit --omit=dev`; it can include build tools declared in dependencies.

| Manifest | Before high / critical | Candidate all high / critical | Candidate production high / critical | Lock resolution / clean-install dry run |
|---|---|---|---|---|
| `package.json` | 25 / 0 | 6 / 0 | 5 / 0 | Passed |

All package locks were resolved without running install scripts. The clean-install dry run validates dependency/peer/lock consistency; it is not an application build or native-device test. New compatibility jobs build from the complete repository checkout. Review their results before merging. No automatic merge is configured.

## Explicit framework/tool updates

- `package.json`: vite ^5.4.8 -> 6.4.4

## Remaining high findings

`brace-expansion` (high), `braces` (high), `chokidar` (high), `fast-glob` (high), `micromatch` (high), `tailwindcss` (high).

The audit is not clean. `braces` has no patched release; removing its Tailwind 3 build-tool chain requires a separately verified CSS migration or maintained upstream fix. Other remaining SDK/tool chains require targeted review. These findings are intentionally not suppressed, and security CI can remain red until resolved.

## Ongoing checks

Prepared Dependabot configuration checks npm updates daily and GitHub Actions weekly, plus Node Docker images where applicable. Daily runtime/audit workflows and compatibility builds activate after this configuration reaches the default branch. A separate daily ChatGPT security follow-up is active now. Install lifecycle hooks were skipped during the scan; no credentials or account settings were changed.
