

export type DependentUser = {
    first_name: string;
    last_name: string;
    dni: string;
    id: string;
}

export type User = {
    id: string;
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
}

export type Specialty = {
    name: string;
};

export type Medication = {
    id: string;
    name: string;
    prescription: string;
    sinceWhen : Date;
    untilWhen : Date | null;
    howOften : Date | null;
    isForever : boolean;
}

export type Doctor = {
    id:string;
    name: string;
    specialty: string;
    phone: string;
    email: string;
    addresses: string[];
    user_id:string;
}

export type Appointment = {
    id: string;
    date: Date;
    description: string;
    user_name: string;
    doctor: string;
    user_id: string;
}

export type AppointmentInfo = {
    specialty: string;
    observations: string,
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