require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const LINE_TOKEN = process.env.LINE_NOTIFY_TOKEN;

// API ส่ง LINE Notify
app.post("/send-line-notify", async (req, res) => {
    try {
        console.log("📩 ข้อมูลที่ได้รับ:", req.body);  // ✅ เพิ่มบรรทัดนี้

        const { message } = req.body;
        if (!message) {
            console.error("❌ ไม่มีข้อความแจ้งเตือน");
            return res.status(400).json({ success: false, error: "❌ ไม่มีข้อความแจ้งเตือน" });
        }

        const params = new URLSearchParams();
        params.append("message", message);

        const response = await axios.post("https://notify-api.line.me/api/notify", params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${LINE_TOKEN}`
            }
        });

        console.log("✅ แจ้งเตือน LINE สำเร็จ:", response.data);
        res.json({ success: true, data: response.data });

    } catch (error) {
        console.error("❌ Error LINE Notify:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: error.response ? error.response.data : error.message });
    }
});


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
require("dotenv").config();

console.log("🔑 LINE Token:", process.env.LINE_NOTIFY_TOKEN);
console.log("🚀 Server Port:", process.env.PORT);
