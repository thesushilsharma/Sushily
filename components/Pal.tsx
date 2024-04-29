// npm install @google/generative-ai
"use client";
import type { NextPage } from 'next';
import { useState } from 'react';

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai'

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = "YOUR_API_KEY";

const Home: NextPage = () => {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = async () => {
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });

            const generationConfig = {
                temperature: 1,
                topK: 0,
                topP: 0.95,
                maxOutputTokens: 8192,
            };

            const safetySettings = [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ];

            const chat = model.startChat({
                generationConfig,
                safetySettings,
                history: [

                ],
            });

            const result = await chat.sendMessage(userInput);
            const responseText = result.response.text();
            setResponse(responseText);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 pt-6 md:p-6 lg:p-12">
            <h1 className="text-3xl font-bold mb-4">Sushily</h1>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        placeholder="Type a message..."
                    />
                </div>
                <div className="w-full md:w-1/3 px-3">
                    <button
                        onClick={handleSendMessage}
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Send Message
                    </button>
                </div>
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Response:</h2>
                <p className="text-gray-600">{response}</p>
            </div>
        </div>
    );
};

export default Home;
