const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://pulkitgarg04:pulkit612@mycluster.xentlsi.mongodb.net/zenithlodge";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "67ff2bbfd04ce49bf8eedd45"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();


