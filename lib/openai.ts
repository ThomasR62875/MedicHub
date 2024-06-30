import OpenAI from 'openai';
import {UserData} from "./types";
import {getOpenAIVars} from "../environment";
import {useTranslation} from "react-i18next";
const { OPENAI_API_KEY, OPENAI_API_URL } = getOpenAIVars();


export const recommendQuestionsForAppointment = async (prompt: string, lastAppointmentText: string, demographicInfo: string): Promise<string | null> => {
    const { OPENAI_API_KEY, OPENAI_API_URL } = getOpenAIVars();

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: `${prompt}${lastAppointmentText}\n${demographicInfo}` },
            ],
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating appointment recommendation:', error);
        throw error;
    }
};

