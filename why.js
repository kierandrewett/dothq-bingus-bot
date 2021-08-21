const { spawn } = require("child_process")

spawn("yarn", ["dev"], { stdio: "inherit" })