// Link the purchase smart contract's abi

// when on load
$(document).ready(function () {

    // start metamask

    const goerliChainId = 5;
    const polygonChainId = 137;
    const initialize = () => {
        let web3;

        let purchaseContract;
        //replace with contract address
        const address = "0xAd05cF3Be2b33875c76c5fa1fd50d9862ABB0eaf";

        // replace with abi
        const abi = [
            {
                inputs: [],
                stateMutability: "nonpayable",
                type: "constructor",
                signature: "constructor",
            },
            {
                inputs: [],
                name: "CBS",
                outputs: [{ internalType: "address", name: "", type: "address" }],
                stateMutability: "view",
                type: "function",
                constant: true,
                signature: "0xa1d711ff",
            },
            {
                inputs: [{ internalType: "address", name: "", type: "address" }],
                name: "balancesOfCustomer",
                outputs: [
                    { internalType: "uint256", name: "amount", type: "uint256" },
                    { internalType: "uint256", name: "refund", type: "uint256" },
                ],
                stateMutability: "view",
                type: "function",
                constant: true,
                signature: "0xfd9fbcd5",
            },
            {
                inputs: [],
                name: "get_Refund_Percentage",
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: "view",
                type: "function",
                constant: true,
                signature: "0x12afa5b8",
            },
            {
                inputs: [],
                name: "purchaseWithLuck",
                outputs: [],
                stateMutability: "payable",
                type: "function",
                payable: true,
                signature: "0xb279abe8",
            },
            {
                inputs: [],
                name: "purchaseWithOutLuck",
                outputs: [],
                stateMutability: "payable",
                type: "function",
                payable: true,
                signature: "0xeb02392b",
            },
            {
                inputs: [],
                name: "recieve",
                outputs: [],
                stateMutability: "payable",
                type: "function",
                payable: true,
                signature: "0xa9e10bf2",
            },
            {
                inputs: [],
                name: "refund",
                outputs: [],
                stateMutability: "payable",
                type: "function",
                payable: true,
                signature: "0x590e1ae3",
            },
        ];

        connect = async () => {
            const { ethereum } = window;
            if (ethereum) {
                console.log("ethreum provider detected");
                await ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(ethereum);
                purchaseContract = new web3.eth.Contract(abi, address);

                //  await switchNetwork(polygonChainId);
            }
        }



        connect();

        let payment1 = $("#payment1")
        let payment2 = $("#payment2")
        let payment3 = $("#payment3")

        let price1 = $("#price1")
        let price2 = $("#price2")
        let price3 = $("#price3")

        let disasterSimulation = $("#disaster-simulation")


        const postRequestForSuggestedPrice = async (price, priceTag) => {

            const response = await fetch('/api/v1/get-suggested-price', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ productPrice_INBTC: price })
            });
            const data = await response.json();

            priceTag.text(data.suggested_Price);
            return data.suggested_Price
        }
        const postToToggleDiasterMode = async () => {

            const response = await fetch('/api/v1/disaster-mode-toggle', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({})
            });

        }

        const purchaseWithOutLuck = async (suggested_Price, account) => await purchaseContract.methods
            .purchaseWithOutLuck()
            .send({
                from: account,
                value: web3.utils.toWei(String(suggested_Price).slice(0, 9), "ether"),
            });


        payment1.click(async (event) => {
            let suggested_Price = await postRequestForSuggestedPrice(price1.text().trim().split(' ')[1], price1)
            const accounts = await web3.eth.getAccounts();
            await purchaseWithOutLuck(suggested_Price, accounts[0])

        });

        payment2.click(async (event) => {
            let suggested_Price = await postRequestForSuggestedPrice(price2.text().trim().split(' ')[1], price2)
            const accounts = await web3.eth.getAccounts();
            await purchaseWithOutLuck(suggested_Price, accounts[0])
        });

        payment3.click(async (event) => {
            let suggested_Price = await postRequestForSuggestedPrice(price3.text().trim().split(' ')[1], price3)
            const accounts = await web3.eth.getAccounts();
            await purchaseWithOutLuck(suggested_Price, accounts[0])
        });

        disasterSimulation.click(async (event) => {
            await postToToggleDiasterMode();
        })



    }

    window.addEventListener('DOMContentLoaded', initialize);


    /** Contracts and purchase */





});