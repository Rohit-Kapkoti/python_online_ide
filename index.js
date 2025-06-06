const express = require("express");
const cors = require("cors");
const codeRoutes = require("./routes/codeRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/code", codeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log("Server running on port 5000"));
