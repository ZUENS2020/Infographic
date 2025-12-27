import OpenAI from 'openai';

export const createOpenAIClient = (apiKey: string, baseURL: string) => {
    return new OpenAI({
        apiKey,
        baseURL,
        dangerouslyAllowBrowser: true
    });
};
