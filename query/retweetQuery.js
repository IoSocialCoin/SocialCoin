import needle from "needle";
import dotenv from 'dotenv';

dotenv.config();

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'



const token = process.env.BEARER_TOKEN;

// You can replace the ID given with the Tweet ID you wish to lookup Retweeting users for
// You can find an ID by using the Tweet lookup endpoint
const id = "1467601870717784065";

const endpointURL = `https://api.twitter.com/2/tweets/${id}/retweeted_by`;

async function getRequest() {
    // These are the parameters for the API request
    // by default, only the Tweet ID and text are returned
    const params = {
        "tweet.fields": "lang,author_id", // Edit optional query parameters here
        "user.fields": "created_at", // Edit optional query parameters here
    };

    // this is the HTTP header that adds bearer token authentication
    const res = await needle("get", endpointURL, params, {
        headers: {
            "User-Agent": "v2RetweetedByUsersJS",
            authorization: `Bearer ${token}`
        },
    });

    if (res.body) {
        return res.body;
    } else {
        throw new Error("Unsuccessful request");
    }
}

(async() => {
    try {
        // Make request
        const response = await getRequest();
        let filteredResponse = [];
        let i = 0;
        while (i < response.data.length) { /* test with a for loop to save only the usernames */
            filteredResponse.push(response.data[i].username);
            i++;
        }

        console.dir(filteredResponse, {
            depth: null,
        });
    } catch (e) {
        console.log(e);
        process.exit(-1);
    }
    process.exit();
})();