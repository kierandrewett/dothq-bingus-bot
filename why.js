const { spawn } = require("child_process")

spawn("yarn", [""], { stdio: "inherit" }).on("close", () => {
    spawn("yarn", ["dev"], { stdio: "inherit" });
});