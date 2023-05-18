const data = require("./data");
const pick = arr => arr[Math.floor(Math.random() * data.length)];

const first = pick(data);
let second;
do {
    second = pick(data);
} while(first == second);

console.log(first.title, "--->", second.title);