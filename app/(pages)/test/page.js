
const cron = require('node-cron');
export default function page() {
    cron.schedule('0 12 * * *', async () => {
        const a = 5;  // Replace with your actual value
        const b = 10; // Replace with your actual value
        const result = a + b;
        console.log(result);
    })
    console.log("kkkkkkk");
}
