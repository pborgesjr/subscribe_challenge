const readline = require("readline");
const fs = require('fs');

const basicSalesTax = 0.1;
const importDutyTax = 0.05;

const getRoudedTaxes = (tax, pricePerUnit) => {
   const taxPerUnit = pricePerUnit * tax;
   const roundedTax = Math.ceil(taxPerUnit*20)/20;

   return roundedTax;
};

const getTotalAndTaxes = (item) => {
    const { price, amount, isExempt, isImported } = item;
    const tax = (isExempt ? 0 : basicSalesTax) + (isImported ? importDutyTax : 0);
    const roundedTax = getRoudedTaxes(tax, price);

    return roundedTax * amount; 
};

const calculateEachItem = (allItems) => {

    return allItems.reduce((acc, item) => {
        const { amount, name, price } = item;
        const itemTaxes = getTotalAndTaxes(item);
        const itemPrice = price * amount;

        console.log(`${amount} ${name}: ${Number(itemPrice + itemTaxes).toFixed(2)}`);

        return { total: acc.total + itemPrice + itemTaxes, taxes: acc.taxes + itemTaxes };
    }, {total: 0, taxes: 0});
};

const returnReceipt = (input) => {

    fs.readFile(`${input}.txt`, 'utf-8', (err, data) => {
        if(err) {
            console.log('Ops, erro ao ler o arquivo..');
            return;
        }
        const newData = data.split('\r\n').map((item) => {
            const amount = item.match(/^\w+/)[0];
            const price = item.match(/[0-9]+.[0-9]+/)[0];
            const name = item.replace(/\sat +[0-9]+.[0-9][0-9]/, '').replace(/^\w+\s/, '');
            const isImported = name.indexOf('imported') > -1;
            const isExempt = name.includes('pills') || name.includes('book') || name.includes('chocolate');

            return {
                amount, price, name, isImported, isExempt
            }
        });


        const { total, taxes } = calculateEachItem(newData);
    
        console.log(`Sales Taxes: ${Number(taxes).toFixed(2)}`)
        console.log(`Total: ${Number(total).toFixed(2)}`)
        
    })

}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

rl.question('Choose between: input1, input2 or input3\n', function(answer) {
    returnReceipt(answer);
    rl.close();
  });