exports.generatePythonFileName = () => {
    const random = Math.random().toString(36).substring(2, 10);
    return `code-${random}.py`;
};
