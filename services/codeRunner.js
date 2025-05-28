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

        // Write code to temp .py file
        fs.writeFileSync(codePath, code);

        // Run python file directly using system python3
        const isWindows = process.platform === "win32";
        const pythonCmd = isWindows ? "python" : "python3";
        const pythonProcess = spawn(pythonCmd, [codePath]);


        let output = "";
        let error = "";

        // Send user input if provided
        if (input) {
            pythonProcess.stdin.write(input);
        }
        pythonProcess.stdin.end();

        // Collect stdout
        pythonProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        // Collect stderr
        pythonProcess.stderr.on("data", (data) => {
            error += data.toString();
        });

        // Handle process completion
        pythonProcess.on("close", (code) => {
            // Clean up temp file
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
