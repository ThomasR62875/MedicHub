import OpenAI from 'openai';


export type AppointmentInfo = {
    specialty: string;
    date: string;
}

export type UserData = {
    lastAppointment: AppointmentInfo;
    medicalInfo: {
        medicalConditions: string[];
        sex: string;
        age: number;
    };
}

const openai = new OpenAI({
    apiKey: '',
});

export const recommendAppointment = async (userData: UserData): Promise<string | null> => {
    try {
        const { lastAppointment, medicalInfo } = userData;
        const { medicalConditions, sex, age } = medicalInfo;

        const prompt = `Given my medical information, what is your recommendation for my next dentist appointment (respond with the date in this format Date)?:\n`;
        const lastAppointmentText = `Appointment with ${lastAppointment.specialty} (last appointment on ${lastAppointment.date})`;
        const demographicInfo = `Sex: ${sex}, Age: ${age}`;
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
