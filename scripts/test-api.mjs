import OpenAI from 'openai';

const config = {
    apiKey: "sk-o9FpN-xwUmQn-ISCvb6Hrw",
    baseURL: "https://litellm.zuens2020.work/v1",
    model: "gemini/gemini-3-flash-preview"
};

console.log("Testing API Connection...");
console.log("Base URL:", config.baseURL);
console.log("Model:", config.model);

const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
});

async function test() {
    try {
        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: "Say hello!" }],
            model: config.model,
        });
        console.log("Success!");
        console.log("Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Failed:", error);
    }
}

test();
