export const chatWithGemini = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: message }],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        const botReply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response.";

        res.status(200).json({ reply: botReply });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
