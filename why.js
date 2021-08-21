const { spawn } = require("child_process")

spawn("apt-get", ["install", "libnss"], { stdio: "inherit" }).on("close", () => {
    spawn("yarn", [""], { stdio: "inherit" }).on("close", () => {
        spawn("yarn", ["dev"], { stdio: "inherit" });
    });
});