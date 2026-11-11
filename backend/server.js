const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./configs/db");

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});