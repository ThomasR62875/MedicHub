// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "npm:@supabase/supabase-js@^2.42.0";
import { Novu } from "npm:@novu/node@latest"
import app from "../../../App.tsx";


type Appointment = {
  id: string;
  date: Date;
  description: string;
  user_name: string;
  doctor: string;
  user_id: string;
  observations: string;
}

type DependentUser = {
  first_name: string;
  last_name: string;
  dni: string;
  id: string;
  sex: string;
  birthdate: Date;
}

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  addresses: string[];
  user_id: string;
}

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
)

const novu = new Novu('8174d59d606b3e4c69ac095e52bf9ae1');

Deno.serve(async (req) => {
  const { name } = await req.json()

  await checkAppointments();

  return new Response(
    JSON.stringify(name),
    { headers: { "Content-Type": "application/json" } },
  )
})

async function sendNotification(date: Date, description:string, user_name:string, doctor: string, user_id: string, email:string) {
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();

  const formattedHours: string = hours.toString().padStart(2, '0');
  const formattedMinutes: string = minutes.toString().padStart(2, '0');


  await novu.trigger('appointment-reminder', {
    to: {
      subscriberId: user_id,
      email: email
    },
    payload: {
      first_name: user_name,
      appointmentTime: `${formattedHours}:${formattedMinutes}`,
      appointmentDay: date.getDate(),
      appointmentMonth: date.getMonth(),
      appointmentYear: date.getFullYear(),
      description: description,
      doctor: doctor
    },
  });
}

async function checkAppointments() {
  const now = new Date();
  const localTimeArgentina = new Date(now.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));

  const appointments = await getNotificationAppointments();
  if (appointments) {
    for (const appointment of appointments) {

      const user_id = await getUserRelation(appointment.user_id);
      if (!user_id) continue;

      const email = await getNotificationEmail(user_id);
      if (!email) continue;

      const appointmentDate = new Date(appointment.date);

      if(daysBetween(localTimeArgentina, appointmentDate) == 1){
        try {
          await sendNotification(appointmentDate, appointment.description, appointment.user_name, appointment.doctor, appointment.user_id, email);
          await updateNotification(appointment.id)
        } catch (notificationError) {
          console.error('Error sending notification:', notificationError);
        }
      }

    }
  }
}

const getNotificationAppointments = async () : Promise<Appointment[] | undefined> => {
  const to_return: Appointment[] = [];


  const {data, error, status} = await supabase.rpc('get_notification_appointments_d_b')
  if (error) {
    console.error('Error getting notification appointments data:', error.message);
  }

  for (const appointment of data)  {
    const user: (DependentUser) = await getUser(appointment.user);
    const doctor: (Doctor) = await getDoctor(appointment.doctor);

    const new_appoint:Appointment =  {
      id: appointment.id,
      description: appointment.description,
      date: appointment.date,
      user_name: user.first_name,
      doctor: doctor && doctor.name ? doctor.name.concat(" (especialidad: ").concat(doctor.specialty).concat(")") : 'Sin datos de doctor',
      user_id: appointment.user,
      observations: appointment.observations
    }
    to_return.push(new_appoint);

  }

  if (error) {
    console.error('Error inserting specialty data:', error.message);
  }
  return to_return
}

const getUserRelation = async (user_id:String) : Promise<String | undefined> =>{

  const {data, error} = await supabase.rpc('get_authentication_id', {user_id: user_id});

  if (error) {
    console.error('Error getting independent user id:', error.message);
  }

  return data;
}

const getNotificationEmail = async (user_id:String) : Promise<string | undefined> =>{

  const {data, error} = await supabase.rpc("get_notification_email", {user_id: user_id});

  if (error) {
    console.error('Error getting users email:', error.message);
  }

  return data;
}

const updateNotification = async (appointment_id: string)  =>{
  const { error} = await supabase.rpc('update_notification_day_before', {appointment_id_input: appointment_id});

  if (error) {
    console.error('Error getting independent user id:', error.message);
  }
}


const getUser = async (session_user_id:String) : Promise<DependentUser> => {
  const { data, error } = await supabase.rpc('get_user', { user_id: session_user_id });
  if (error) {
    console.error('Error inserting users data:', error.message);
  }
  return data
}

const getDoctor = async (doctor_id : string) : Promise<Doctor> => {
  const { data, error } = await supabase.rpc('get_doctor',{doctor_id: doctor_id});
  if (error) {
    console.error('Error getting doctor data:', error.message);
  }
  return data
}

function daysBetween(date1: Date, date2: Date): number {
  const day1 = date1.getDate();
  const month1 = date1.getMonth();
  const year1 = date1.getFullYear();

  const day2 = date2.getDate();
  const month2 = date2.getMonth();
  const year2 = date2.getFullYear();


  function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function daysInMonth(month: number, year: number): number {
    const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month];
  }

  function dateToDays(day: number, month: number, year: number): number {
    let days = day;
    for (let y = 0; y < year; y++) {
      days += isLeapYear(y) ? 366 : 365;
    }
    for (let m = 0; m < month; m++) {
      days += daysInMonth(m, year);
    }
    return days;
  }

  const days1 = dateToDays(day1, month1, year1);
  const days2 = dateToDays(day2, month2, year2);

  return days2 - days1;
}


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notification-day-before' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
