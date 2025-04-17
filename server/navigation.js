import axios from 'axios';

export async function get_location_info(system,waypoint) {
    try {
      const response = await axios.get(`https://api.spacetraders.io/v2/systems/${system}/waypoints/${waypoint}`);
      console.log(`return to route, ${response.data}`);
      return response.data;
  } catch (error) {
      console.error("Error during API call:", error);
      throw error;
  }
  }