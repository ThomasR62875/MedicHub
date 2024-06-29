import OpenAI from 'openai';
import {UserData} from "./types";
import getEnvVars, {getOpenAIVars} from "../environment";
import {useTranslation} from "react-i18next";
const { OPENAI_API_KEY, OPENAI_API_URL } = getOpenAIVars();

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export const recommendQuestionsForAppointment = async (userData: UserData): Promise<string | null> => {
    const {t} = useTranslation();
    try {
        const { lastAppointment, medicalInfo } = userData;
        const { sex, age } = medicalInfo;

        const prompt = t('questionPromptP1');
        const lastAppointmentText = t('lastAppointmentText', {
            specialty: lastAppointment.specialty,
            date: lastAppointment.date,
            observations: lastAppointment.observations
        });
        const demographicInfo = t('demographicInfo', {
            sex: sex,
            age: age?? null
        });

        console.log(`${prompt}${lastAppointmentText}\n${demographicInfo}`);
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
