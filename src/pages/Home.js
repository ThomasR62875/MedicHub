import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";


const Home = () => {
    console.log(supabase)


    const [fetchError, setFetchError] = useState(null)
    const [smoothies, setSmoothies] = useState(null)

    useEffect(() => {
        const fetchSmoothies = async () => {
            const { data, error } = await supabase
                .from('smoothies')
                .select()

                if(error) {
                    setFetchError('Could not fetch smoothies')
                    setSmoothies(null)
                    console.log(error)
                }
                if(data){
                    setSmoothies(data)
                    setFetchError(null)
                }
        }
        fetchSmoothies() //como se llama la funciion
    }, [])

    return (
        <div className="page home">
            {fetchError && (<p>{fetchError}</p> )}
            {smoothies && (
                <div className="smoothie">
                    {smoothies.map(smoothies => (
                        <p>{smoothies.title}</p>
                    ))
                    }
                </div>
            )}
            <h1>Home</h1>
        </div>
    )
}

export default Home