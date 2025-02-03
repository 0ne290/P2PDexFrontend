import { ref } from 'vue'
import { defineStore } from 'pinia'
import { MetaMaskSDK, SDKProvider } from "@metamask/sdk"
import { fromWei, hexToNumber } from 'web3-utils';

export const useMetamaskStore = defineStore('metamask', () => {
    let sdk!: MetaMaskSDK

    let provider!: SDKProvider

    async function init() {
        sdk = new MetaMaskSDK({
            dappMetadata: {
                name: "P2P DEX",
                url: window.location.href,
            }
        });

        await sdk.init();

        const providerTemp = sdk.getProvider();
        if (providerTemp == undefined)
            throw new Error('Cannot get metamask SDK provider.');

        provider = providerTemp;
    }

    const walletAddress = ref('')

    const walletBalance = ref('')

    const isAuth = ref(false)

    async function auth() {
        walletAddress.value = (await sdk.connect())[0];

        console.log(walletAddress.value);

        walletBalance.value = fromWei(hexToNumber(await provider.request({
            method: "eth_getBalance",
            params: [
                walletAddress.value,
                "latest"
            ]
        }) as string), "ether");

        console.log(walletBalance.value);

        isAuth.value = true;
    }

    return { sdk, provider, init, walletAddress, walletBalance, isAuth, auth }
})
