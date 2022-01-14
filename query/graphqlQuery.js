import fetch from "node-fetch";



async function getTransactions() {
    let queryParams = `{
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
}`;
    let results = await fetch('https://iotex-mainnet.chainanalytics.org/api/v1/graphql', {
        method: 'POST',

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query: queryParams
                /*`{
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
}

getTransactions()