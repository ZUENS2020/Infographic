import { useState, useEffect } from 'react';
import { createOpenAIClient } from '../services/openai';

export interface OpenAIConfig {
    apiKey: string;
    baseURL: string;
    model: string;
}

export const useOpenAI = () => {
    const [config, setConfig] = useState<OpenAIConfig>({
        apiKey: '',
        baseURL: 'https://api.openai.com/v1',
        model: 'gpt-3.5-turbo',
    });

    const [models, setModels] = useState<string[]>([]);
    const [loadingModels, setLoadingModels] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Load config from backend
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                if (data.apiKey) {
                    const newConfig = { ...config, ...data };
                    setConfig(newConfig);
                    // Proactively fetch models after config is loaded
                    fetchModels(newConfig);
                }
            })
            .catch(err => console.error("Failed to load config", err));
    }, []);

    const fetchModels = async (targetConfig: OpenAIConfig) => {
        if (!targetConfig.apiKey) return;
        setLoadingModels(true);
        setError(null);
        try {
            const client = createOpenAIClient(targetConfig.apiKey, targetConfig.baseURL);
            const list = await client.models.list();
            const modelIds = list.data.map(m => m.id).sort();
            setModels(modelIds);
        } catch (err: any) {
            console.error("Failed to fetch models", err);
            setError(err.message || "Failed to fetch models");
        } finally {
            setLoadingModels(false);
        }
    };

    return {
        config,
        models,
        loadingModels,
        fetchModels,
        error
    };
};
