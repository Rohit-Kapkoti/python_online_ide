const runCode = require("../services/codeRunner");

exports.executeCode = async (req, res) => {
    try {
        const { code, input } = req.body;
        const output = await runCode(code, input);
        res.status(200).json({ output });
    } catch (err) {
        console.error("Execution Error:", err);
        res.status(500).json({
            error: "Code execution failed",
            details: err.message, // include error message in response
        });
    }
};
