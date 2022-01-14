import fetch from "node-fetch";
import dotenv from 'dotenv';

dotenv.config();

let _days = new Date();
let days = (_days.getUTCDate()).toString();

let _years = new Date();
let years = (_years.getUTCFullYear()).toString();

let _hours = new Date();
let hours = (_hours.getUTCHours()).toString();

let _minutes = new Date();
let minutes = _minutes.getUTCMinutes();

/* corrects minute format to always have 2 digits */

function setMinutesCorrectly() {
    let correctedMinutes
    if (minutes <= 9) {
        correctedMinutes = "0" + minutes.toString();
        return correctedMinutes;
    } else {
        correctedMinutes = minutes.toString();
        return correctedMinutes;
    }
}

let queryMinutes = setMinutesCorrectly();

let _months = new Date();
let months = ((_months.getUTCMonth()) + 1);

/* function corrects the month format as this returns as follows : jan=0, feb=1 etc
and the query parameters have a traditionnal month number jan=01 etc*/

function setMonthsCorrectly() {
    let correctedMonth;
    if (months <= 9) {
        correctedMonth = "0" + (months.toString());
        return correctedMonth;
    } else {
        correctedMonth = months.toString();
        return correctedMonth;
    }
}

let queryMonth = setMonthsCorrectly();


let fullDate = years + "-" + queryMonth + "-" + days + 'T' + hours + ":" + queryMinutes + ":" + "00"; //adding special characters to match format


let queryDate;

function setNextQueryDate() {
    queryDate = fullDate;
    return queryDate;
}


//${setNextQueryDate()} this embeded works, but calls with the current date so value will always be 0

async function getTransactions() {
    let queryParams = `{
    token_erc20 (where :{
        _and:[
          {contract_address:
            {_eq:"io1zl0el07pek4sly8dmscccnm0etd8xr8j02t4y7"}}
          {recipient:
            {_eq:"io1cz340sadrx0zumau3e9vms8ulcy3kuguljcevt"}}
          {timestamp:{_gt:"${queryDate}"}}
        ]
      }
      )
      {
        amount
      }
}`;
    let results = await fetch('https://iotex-mainnet.chainanalytics.org/api/v1/graphql', {
        method: 'POST',

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query: queryParams
                /* `{
                             token_erc20 (where :{
                                 _and:[
                                   {contract_address:
                                     {_eq:"io1zl0el07pek4sly8dmscccnm0etd8xr8j02t4y7"}}
                                   {recipient:
                                     {_eq:"io1cz340sadrx0zumau3e9vms8ulcy3kuguljcevt"}}
                                   {timestamp:{_gt:"2022-01-9T00:00:00"}}
                                 ]
                               }
                               )
                               {
                                 amount
                               }
                         }`*/
        })
    })
    let sum;
    let amount = await results.json();
    sum = amount.data.token_erc20.reduce((acc, current) => acc + current.amount, 0);
    console.log(sum);
    setNextQueryDate();
}

getTransactions()
setNextQueryDate()
console.log(getTransactions());