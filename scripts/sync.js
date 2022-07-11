const Web3 = require("web3");
const web3 = new Web3(process.env.RPC);

const TRANSACTIONS = require("../schema/transactions");

async function init(){
    let blockNumber = "latest";
    let getNumberOfBlocks = parseInt(process.env.GET_NUMBER_OF_BLOCKS);
    for(let i = 0; i < getNumberOfBlocks; i++){
        let blockDetails = await getBlockDetails(blockNumber).then(blockDetails => blockDetails).catch(error => error);
        if(blockDetails instanceof Error) {
            console.log("init >> get block details >> error >> ", blockDetails);
            continue;
        }
        blockNumber = blockDetails.number - 1;
        for(let j = 0; j < blockDetails.transactions.length; j++){
            let transactionHash = blockDetails.transactions[j];
            console.log(`blockNumber >> ${blockDetails.number} >> transactionHash >> ${transactionHash}`);
            let transactionDetails = await getTransactionDetails(transactionHash).then(transactionDetails => transactionDetails).catch(error => error);
            if(transactionDetails instanceof Error) {
                console.log("init >> get transaction details >> error >> ", transactionDetails);
                continue;
            }
            let saveTransactionPayload = {
                transactionHash: transactionDetails.hash,
                from: transactionDetails.from,
                to: transactionDetails.to,
                value: parseFloat(transactionDetails.value),
                timestamp: blockDetails.timestamp,
                blockHash: transactionDetails.blockHash,
                blockNumber: transactionDetails.blockNumber
            };
            let savedTransactionDetails = await saveTransactionDetails(saveTransactionPayload).then(savedTransactionDetails => savedTransactionDetails).catch(error => error);
            if(savedTransactionDetails instanceof Error) {
                // console.log("init >> saving transaction details >> error >> ", savedTransactionDetails);
                continue;
            }
        }
    }
    console.log("Script execution is complete.");
}

function getBlockDetails(payload){
    return new Promise((resolve, reject) => {
        try{
            web3.eth.getBlock(payload).then(blockDetails => {
                return resolve(blockDetails);
            });
        }catch(error){
            console.log("getBlockDetails >> error >> ", error);
            return reject(error);
        }
    })
}

function getTransactionDetails(payload){
    return new Promise((resolve, reject) => {
        try{
            web3.eth.getTransaction(payload).then(transactionDetails => {
                return resolve(transactionDetails);
            });
        }catch(error){
            console.log("getTransactionDetails >> error >> ", error);
            return reject(error);
        }
    })
}

function saveTransactionDetails(payload){
    return new Promise(async (resolve, reject) => {
        try{
            const transactionsSchema = new TRANSACTIONS(payload);
            let savedTransactionDetails = await transactionsSchema.save().then(savedTransactionDetails => savedTransactionDetails).catch(error => error);
            return resolve(savedTransactionDetails);
        }catch(error){
            console.log("saveTransactionDetails >> error >> ", error);
            return reject(error);
        }
    })
}

module.exports = { init }
