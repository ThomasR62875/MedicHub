// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "npm:@supabase/supabase-js@^2.42.0";
import { Novu } from "npm:@novu/node@latest"



type Medication = {
  id: string;
  name: string;
  prescription: string;
  sinceWhen: Date;
  untilWhen: Date | null;
  howOften: Date | null;
  isForever: boolean;
  user_id: string;
}

type DependentUser = {
  first_name: string;
  last_name: string;
  dni: string;
  id: string;
  sex: string;
  birthdate: Date;
}

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
)

const novu = new Novu(Deno.env.get("NOVU_API_KEY")!);


Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  await checkMedications();

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

async function sendNotification(name:string, medication:string, prescription: string, subscriberId: string, email:string) {

  await novu.trigger('medication-notification', {
    to: {
      subscriberId: subscriberId,
      email: email
    },
    payload: {
      name: name,
      medication: medication,
      prescription: prescription,
    },
  });

}

async function checkMedications() {

  const medications = await getMedications();
  if (medications) {
    for (const medication of medications) {

      const user_that_takes = await getUserByMedication(medication.id);
      const parent_user_id = await getUserRelation(user_that_takes.id);

      if(!parent_user_id) continue;
      const  email = await getNotificationEmail(parent_user_id);
      if (!email) continue;

      if(shouldTakeMedication(medication, 60000)){
        try {
          await sendNotification(user_that_takes.first_name, medication.name, medication.prescription, parent_user_id, email);
        } catch (notificationError) {
          console.error('Error sending notification:', notificationError);
        }
      }

    }
  }
}

const getMedications = async () : Promise<Medication[] | undefined> => {
  const to_return: Medication[] = [];

  const {data, error} = await supabase.rpc('get_all_medications')
  if (error) {
    console.error('Error getting notification appointments data:', error.message);
  }

  for (const medication of data)  {

    const new_medication:Medication =  {
      id: medication.id,
      name: medication.name,
      prescription: medication.prescription,
      untilWhen: medication.untilWhen,
      howOften: medication.howOften,
      sinceWhen: medication.sinceWhen,
      isForever: medication.isForever,
      user_id: medication.user_id
    }
    to_return.push(new_medication);
  }

  if (error) {
    console.error('Error inserting specialty data:', error.message);
  }
  return to_return
}

const getUserRelation = async (user_id:string) : Promise<string | undefined> =>{

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

export const getUserByMedication = async (medication_id: string) : Promise<DependentUser> => {

  const { data, error } = await supabase.rpc('get_user_by_medication', { medication_id: medication_id });
  if (error) {
    console.error('Error inserting users data:', error.message);
  }
  return data
}

function shouldTakeMedication(medication: Medication, marginOfErrorMs: number): boolean {
  if (medication.untilWhen == null || medication.sinceWhen == null || medication.howOften == null) {
    return false;
  }

  const now = new Date();
  const localTimeArgentina = new Date(now.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
  const endDate = new Date(medication.untilWhen + "T00:00:00-03:00");
  const startDate = new Date(medication.sinceWhen);
  const howOftenString = medication.howOften.toISOString();
  const howOftenMilliseconds = parseTime(howOftenString);

  if (!medication.isForever && localTimeArgentina > endDate) {
    return false;
  }

  const timeDiff = localTimeArgentina.getTime() - startDate.getTime();
  const dosesTaken = Math.floor(timeDiff / howOftenMilliseconds);
  const nextDoseTime = new Date(startDate.getTime() + (dosesTaken) * howOftenMilliseconds);
  const nextDoseTimePlusMargin = new Date(nextDoseTime.getTime() + marginOfErrorMs);

  return localTimeArgentina >= nextDoseTime && localTimeArgentina < nextDoseTimePlusMargin;
}




function parseTime(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notification-for-medication' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
