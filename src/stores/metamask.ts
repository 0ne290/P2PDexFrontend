import { ref } from 'vue'
import { defineStore } from 'pinia'
import { MetaMaskSDK, SDKProvider } from "@metamask/sdk"
import { fromWei, hexToNumber } from 'web3-utils';

export const useMetamaskStore = defineStore('metamask', () => {
    const sdk = ref<MetaMaskSDK>()

    const provider = ref<SDKProvider>()

    async function init() {
        sdk.value = new MetaMaskSDK({
            dappMetadata: {
                name: "P2P DEX",
                url: window.location.href,
            }
        });

        await sdk.value.init();

        const providerTemp = sdk.value.getProvider();
        if (providerTemp == undefined)
            throw new Error('Cannot get metamask SDK provider.');

        provider.value = providerTemp;
    }

    const walletAddress = ref('')

    const walletBalance = ref('')

    const isAuth = ref(false)

    async function auth() {
        walletAddress.value = (await sdk.value!.connect())[0];

        const balance = fromWei(hexToNumber(await provider.value!.request({
            method: "eth_getBalance",
            params: [
                walletAddress.value,
                "latest"
            ]
        }) as string), "ether");

        walletBalance.value = balance.slice(0, balance.indexOf('.') + 7);

        isAuth.value = true;
    }

    return { sdk, provider, init, walletAddress, walletBalance, isAuth, auth }
})
