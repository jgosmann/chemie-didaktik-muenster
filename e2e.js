const child_process = require("child_process")
const path = require("path")
const waitOn = require("wait-on")

require("dotenv").config()

const shutdown = process => {
  new Promise((resolve, reject) => {
    process.kill()
    process.on("exit", resolve)
    setTimeout(() => reject(new Error("timeout")), 5000)
  }).catch(err => {
    if (err instanceof Error && err.message == "timeout") {
      return new Promise((resolve, reject) => {
        process.kill("SIGKILL")
        process.on("ext", resolve)
        setTimeout(() => reject(new Error("timeout")), 5000)
      })
    }
    throw err
  })
}

const analytics_backend = child_process.spawn(
  "poetry",
  [
    "run",
    "uvicorn",
    "cdm_analytics.main:app",
    "--host",
    "localhost",
    "--port",
    "8001",
  ],
  {
    cwd: path.resolve("./analytics"),
    env: {
      ...process.env,
      SECURE_KEY: "signing key",
      BUILDER_ACCESS_TOKEN: process.env.ANALYTICS_BUILDER_CLIENT_SECRET,
      ADDITIONAL_CORS_DOMAINS: '["http://localhost:9000"]',
    },
    stdio: "inherit",
  }
)

waitOn({ resources: ["http://127.0.0.1:8001/health"], timeout: 5000 })
  .then(() => {
    const build = child_process.spawnSync("gatsby", ["build"], {
      stdio: "inherit",
      env: { ...process.env, NODE_OPTIONS: "" },
    })
    if (build.status !== 0) {
      throw new Error("Gatsby build failed.")
    }

    const frontend_server = child_process.spawn("gatsby", ["serve"], {
      stdio: "inherit",
    })
    return waitOn({ resources: ["http://localhost:9000/"], timeout: 5000 })
      .then(() => {
        const cypress = child_process.spawnSync("cypress", ["run"], {
          stdio: "inherit",
        })
        if (cypress.status !== 0) {
          throw new Error("Cypress E2E tests failed.")
        }
      })
      .finally(() => {
        shutdown(frontend_server)
      })
  })
  .finally(() => {
    shutdown(analytics_backend)
  })
