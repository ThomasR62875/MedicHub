/*import {Session} from "@supabase/supabase-js";

export interface AllSession {   //La idea es pasar este como session asi no tenes que pedir el id en supabas
    session : Session
    id : string
    dni: string

}

La idea es hacer una libreria de nuestras cosas para no repetir código            */

import {Appointment, DependentUser, RecommendationAppointment, SexGenderOption, Specialty} from "./types";
import {getAge, getAppointmentInterval, getDoctor} from "./supabase";
import {t} from "i18next";

export const getDate = (date: Date) => {
    return date ? date.toLocaleDateString() : 'Seleccione una fecha';
};



export function formatDate(dateString: string | number | Date) {
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day+1} de ${month}`;
}

export const getRecommendations = async (
    allUsers: DependentUser[] | undefined,
    specialties: Specialty[] | null,
    futureAppointments: Appointment[] | undefined,
    lastAppointments: Appointment[] | undefined,
): Promise<RecommendationAppointment[]> => {

    const recommendations: RecommendationAppointment[] = [];
    for (const user of allUsers!) {
        for (const speciality of specialties!) {
            const hasFutureAppointment = await Promise.all(
                futureAppointments?.map(async appointment => {
                    const doctor = await getDoctor(appointment.doctor);
                    if (!doctor) {
                        return false;
                    }
                    return (
                        appointment.user_id === user.id &&
                        doctor.specialty === speciality.name
                    );
                }) || []
            );

            if (!hasFutureAppointment.some(appointment => appointment)) {
                let hasLastAppointments: any[] = [];

                if (lastAppointments && lastAppointments.length > 0) {
                    const appointmentsWithDoctor = await Promise.all(lastAppointments.map(async appointment => {
                        const doctor = await getDoctor(appointment.doctor);
                        if (!doctor) {
                            return {
                                ...appointment,
                                doctorSpecialty: undefined, // or handle the absence of doctor
                            };
                        }
                        return {
                            ...appointment,
                            doctorSpecialty: doctor.specialty,
                        };
                    }));

                    hasLastAppointments = appointmentsWithDoctor.filter(appointment =>
                        appointment.user_id === user.id &&
                        appointment.doctorSpecialty === speciality.name
                    );
                }

                if (hasLastAppointments.length > 0) {
                    hasLastAppointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    const lastAppointment = hasLastAppointments[0];

                    const interval = await getAppointmentInterval(speciality, getAge(user.birthdate), user.sex);
                    if (interval !== null) {
                        const nextAppointmentDate = new Date(lastAppointment.date);
                        nextAppointmentDate.setDate(nextAppointmentDate.getDate() + interval);

                        const twoDaysFromNow = new Date();
                        twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

                        if (nextAppointmentDate < new Date()) {
                            nextAppointmentDate.setDate(twoDaysFromNow.getDate());
                        }

                        const threeMonthsFromNow = new Date();
                        threeMonthsFromNow.setDate(threeMonthsFromNow.getDate() + 90);

                        if (nextAppointmentDate <= threeMonthsFromNow) {
                            recommendations.push({
                                date: nextAppointmentDate,
                                user_name: user.first_name,
                                doctor: lastAppointment.doctor,
                                user_id: user.id,
                                specialty: speciality.name
                            });
                        } else {
                            recommendations.push({
                                date: twoDaysFromNow,
                                user_name: user.first_name,
                                doctor: lastAppointment.doctor,
                                user_id: user.id,
                                specialty: speciality.name
                            });
                        }
                    }
                } else {
                    const interval = await getAppointmentInterval(speciality, getAge(user.birthdate), user.sex);
                    if (interval !== null && interval !== undefined) {
                        const newAppointmentDate = new Date();
                        newAppointmentDate.setDate(newAppointmentDate.getDate() + 2);

                        recommendations.push({
                            date: newAppointmentDate,
                            user_name: user.first_name,
                            doctor: '',
                            user_id: user.id,
                            specialty: speciality.name
                        });
                    }
                }
            }
        }
    }
    return recommendations;
};

export const sexGenderOptions: SexGenderOption[] = [
    { sex_gender_name: t('male'), value: 'male' },
    { sex_gender_name: t('female'), value: 'female' },
    { sex_gender_name: t('non-binary'), value: 'non-binary' },
    { sex_gender_name: t('other'), value: 'other' },
];

export const getSexGenderName = (value: string) => {
    if(value == null)
        return ''
    const option = sexGenderOptions.find(option => option.value === value);
    return option ? option.sex_gender_name : '';
};