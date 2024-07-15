// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import {createClient} from "npm:@supabase/supabase-js@^2.42.0";
import {Novu} from "npm:@novu/node@latest"


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

      if(hoursBetween(localTimeArgentina, appointmentDate) <= 2){
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

  const {data, error} = await supabase.rpc('get_notification_appointments_t_h_b')
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
      observations: appointment.observations}
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
  const { error} = await supabase.rpc('update_notification_two_hours_before', {appointment_id_input: appointment_id});

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

function hoursBetween(date1: Date, date2: Date): number {
  const differenceMillis = date2.getTime() - date1.getTime();

  let hours = differenceMillis / (1000 * 60 * 60);

  const days = Math.floor(hours / 24);
  hours -= days * 24;

  return hours
}

