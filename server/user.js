import axios from 'axios';

export async function log_in(account_token) {
  try {
    const response = await axios.get('https://api.spacetraders.io/v2/my/agent', {
        headers: {
            'Authorization': `Bearer ${account_token}`,
            'Content-Type': 'application/json'
        }
    });
    console.log(`return to route, ${response.data}`);
    return response.data;
} catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
}


export async function register_user(agent_symbol,faction) {
  axios.post('https://api.spacetraders.io/v2/register', {
      headers: {
          'Authorization': `Bearer ${account_token}`,
          'Content-Type': 'application/json'
      },
      data: {
        "symbol": `${agent_symbol}`,
        "faction":`${faction}`
      }
    })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}