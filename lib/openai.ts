import OpenAI from 'openai';
import {UserData} from "./types";
import getEnvVars, {getOpenAIVars} from "../environment";
const { OPENAI_API_KEY, OPENAI_API_URL } = getOpenAIVars();

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export const recommendQuestionsForAppointment = async (userData: UserData): Promise<string | null> => {
    try {
        const { lastAppointment, medicalInfo } = userData;
        const { medicalConditions, sex, age } = medicalInfo;

        const prompt = `Given my medical information and the information about past appointments with this doctor, which questions do you recommend i should ask my doctor? (the answer should have maximum 150 words):\n`;

        const lastAppointmentText = `The appointment with ${lastAppointment.specialty} (last appointment on ${lastAppointment.date} and the observations were:  ${lastAppointment.observations})`;
        const demographicInfo = `Some information about me: Sex: ${sex}, Age: ${age}`;
        console.log(`${prompt}${lastAppointmentText}\n${demographicInfo}`);
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
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
