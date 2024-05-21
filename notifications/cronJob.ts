import { CronJob } from 'cron';
import {getAppointments, supabase} from '../lib/supabase';
import novu from './novu';
import Appointment from '../screens/Appointments'

/*
export type Appointment = {
    date: Date;
    description:string;
    user_name:string;
    doctor: string;
    user_id: string;
}*/


// Función para enviar notificaciones
async function sendNotification(date: Date, description:string, user_name:string, doctor: string, user_id: string) {
    const email = getNotificationEmail(user_id); // asignar el email al que se le manda
    await novu.trigger('appointment-reminder', {
        to: {
            subscriberId: user_id,
        },
        payload: {
            email,
            firstName,
            message,
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
            const { id, user_id, users, appointment_time } = appointment;
            const { email, first_name } = users;
            const message = `Tienes un turno médico programado para las ${new Date(appointment_time).toLocaleTimeString()}`;



            try {
                await sendNotification(user_id, email, first_name, message);
                await supabase
                    .from('appointments')
                    .update({ notification_sent: true })
                    .eq('id', id);
                console.log('Notification sent for appointment:', id);
            } catch (notificationError) {
                console.error('Error sending notification:', notificationError);
            }
        }
    }
}

// Configurar y iniciar el cron job
const job = new CronJob('*/5 * * * *', checkAppointments); // Ejecutar cada 5 minutos
job.start();