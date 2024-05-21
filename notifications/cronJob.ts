import { CronJob } from 'cron';
import {
    getAppointments,
    getNotificationAppointments,
    getNotificationEmail,
    getUserId, getUserRelation,
    supabase,
    updateNotification
} from '../lib/supabase';
import novu from './novu';
import Appointment from '../screens/Appointments'
import app from "../App";

/*
export type Appointment = {
    id: string,
    date: Date;
    description:string;
    user_name:string;
    doctor: string;
    user_id: string;
}*/


// Función para enviar notificaciones
async function sendNotification(date: Date, description:string, user_name:string, doctor: string, user_id: string, email:string) {
    await novu.trigger('appointment-reminder', {
        to: {
            subscriberId: user_id,
            email: email
        },
        payload: {
            first_name: user_name,
            appointmentTime: new Date().toISOString(),
            description: description,
            doctor: doctor
        },
    });
}

// Función para verificar turnos próximos y enviar notificaciones
async function checkAppointments() {
    const now = new Date();
    const futureTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutos en el futuro

    const appointments = await getNotificationAppointments();

    //fitar appointments

    if (appointments) {
        for (const appointment of appointments) {
            const user_id = await getUserRelation(appointment.user_id);
            if(!user_id) continue;      //verifica q haya un user_id

            const message = `Tienes un turno médico programado para las ${new Date(appointment.date.getTime()).toLocaleDateString()} el dia ${new Date(appointment.date.getDate()).toLocaleDateString()} `;
            const email = await getNotificationEmail(user_id);
            if(!email) continue;

            try {
                await sendNotification(appointment.date, appointment.description, appointment.user_name, appointment.doctor, appointment.user_id, email);
                await updateNotification(appointment.id)
                console.log('Notification sent for appointment:', appointment.id);
            } catch (notificationError) {
                console.error('Error sending notification:', notificationError);
            }
        }
    }
}

// Configurar y iniciar el cron job
const job = new CronJob('*/5 * * * *', checkAppointments); // Ejecutar cada 5 minutos
job.start();