import { useEffect } from "react";
import api from "./services/api";

function App() {

    useEffect(() => {

        async function testRecommendation() {

            try {

                const response = await api.get("/recommendation");

                console.log(response.data);

            } catch (error) {

                console.error(error);

            }

        }

        testRecommendation();

    }, []);

    return <h1>Teste Frontend</h1>;
}

export default App;