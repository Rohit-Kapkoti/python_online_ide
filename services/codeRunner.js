const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { v4: uuid } = require("uuid");


const runCode = (code, input) => {
    return new Promise((resolve, reject) => {
        const jobId = uuid();
        const tempDir = path.join(__dirname, "../temp");
        const codePath = path.join(tempDir, `${jobId}.py`);

        // Ensure temp directory exists
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        fs.writeFileSync(codePath, code);

        // Normalize Windows path for Docker
        const normalizePath = (windowsPath) => {
            return windowsPath.replace(/\\/g, '/');
        };
        const dockerPath = normalizePath(tempDir);

        // Create the Docker command using spawn
        const dockerProcess = spawn("docker", [
            "run",
            "--rm",
            "-i",
            "-v",
            `${dockerPath}:/app`,
            "python:3.11-slim",
            "python",
            `/app/${jobId}.py`
        ]);

        let output = "";
        let error = "";

        // Feed input via stdin
        if (input) {
            dockerProcess.stdin.write(input);
        }
        dockerProcess.stdin.end();

        dockerProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        dockerProcess.stderr.on("data", (data) => {
            error += data.toString();
        });

        dockerProcess.on("close", (code) => {
            // Clean up
            fs.unlinkSync(codePath);

            if (code === 0) {
                resolve(output);
            } else {
                reject(error || "Execution failed");
            }
        });
    });
};

module.exports = runCode;
