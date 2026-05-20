import { calculateRoute } from "./Route";
import { useState } from "react";

export const useRoute = (pathEngine, roadsData) => {

    const [activeRoute, setActiveRoute] = useState(null);

    const handleRouting = (st, en) => {

        if (!pathEngine || !roadsData) {
            
            alert("Not ready!");
            
            return;
        }

        try {

            const routeGeojson = calculateRoute(pathEngine, roadsData, st, en);

            setActiveRoute(routeGeojson);
        }
        catch (error) {
            
            alert(error.message);

            console.error("Fail to find the route");
        }
    }

    return { activeRoute, handleRouting };
}