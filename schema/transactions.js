const mongoose  = require("mongoose");

const TransactionsSchema = mongoose.Schema({
    transactionHash: { type: String, lowercase: true, unique: true, index: true, required: true },
    from: { type: String, required: true },
    to: { type: String, default: null },
    value: { type: String, default: '0' },
    timestamp: { type: Number, default: 0, index: true },
    blockHash: { type: String, index: true },
    blockNumber: { type: Number, default: 0, index: true },
}, { collection: "transactions", versionKey: false, timestamps: true });

module.exports = mongoose.model("transactions", TransactionsSchema);
