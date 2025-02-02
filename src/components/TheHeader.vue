<template>

<header class="header container-fluid border-bottom border-2 second-border-color">
    <div class="row h-100">
        <div class="col-3">
            <div class="row h-100">
                <div class="col p-0 d-flex justify-content-center align-items-center">
                    <span class="text-center">
                        <i class="fa-solid fa-right-to-bracket second-text-color fa-2xl" @click="onMetamaskAuth"></i><br/>
                        Authenticate in Metamask
                    </span>
                </div>
                <div class="col border-start border-2 second-border-color d-flex justify-content-center align-items-center">
                    <span class="text-center" v-if="metamask.isAuth">{{ metamask.walletBalance }} ETH</span>
                    <span class="text-center" v-else>Please authenticate in Metamask.</span>
                </div>
            </div>
        </div>
        <div class="col-6 border-start border-end border-2 second-border-color">
            <div class="text-center" v-if="telegram.isAuth && metamask.isAuth">
                <span class="text-center">
                    <i class="fa-solid fa-right-to-bracket second-text-color fa-2xl" @click="onMetamaskAuth"></i><br/>
                    Sell orders
                </span>
                <span class="text-center">
                    <i class="fa-solid fa-right-to-bracket second-text-color fa-2xl" @click="onMetamaskAuth"></i><br/>
                    Create sell order
                </span>
            </div>
            <span class="text-center" v-else>Authentication in Telegram and Metamask failed, access to tabs is closed.</span>
        </div>
        <div class="col-3">
            <div class="row h-100">
                <div class="col p-0 d-flex justify-content-center align-items-center">
                    <span class="text-center" v-if="telegram.isAuth">@{{ telegram.userName }}</span>
                    <span class="text-center" v-else>Please authenticate in Telegram.</span>
                </div>
                <div ref="telegram-auth-div" class="col border-start border-2 second-border-color d-flex justify-content-center align-items-center">
                </div>
            </div>
        </div>
    </div>
</header>

</template>

<script setup lang="ts">

import { useTemplateRef, onMounted } from 'vue'
import { ensureExistedOfTrader } from '@/services/apiService'
import { useTelegramStore } from '@/stores/telegram'
import { useMetamaskStore } from '@/stores/metamask'
import { MetaMaskSDK } from "@metamask/sdk"
import { fromWei, hexToNumber } from 'web3-utils';

const telegram = useTelegramStore();
const metamask = useMetamaskStore();

const telegramAuthButton = document.createElement("script");
telegramAuthButton.setAttribute(
    "src",
    "https://telegram.org/js/telegram-widget.js?22"
);
telegramAuthButton.setAttribute(
    "data-telegram-login",
    "P2P_DEX_290_Bot"
);
telegramAuthButton.setAttribute(
    "data-size",
    "large"
);
telegramAuthButton.setAttribute(
    "data-userpic",
    "false"
);
telegramAuthButton.setAttribute(
    "data-onauth",
    "onTelegramAuth(user)"
);

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void
  }
}
window.onTelegramAuth = async function (user) {
    await ensureExistedOfTrader(user.username, user.id);
}

const telegramAuthDiv = useTemplateRef('telegram-auth-div');

onMounted(() => {
    if (telegramAuthDiv.value == null) {
        throw new Error("Unexpected error.");
    }

    telegramAuthDiv.value.appendChild(telegramAuthButton);
});

async function onMetamaskAuth() {
    const metamaskSdk = new MetaMaskSDK({
        dappMetadata: {
            name: "P2P DEX",
            url: window.location.href,
        }
    });

    await metamaskSdk.init();

    const ethereum = metamaskSdk.getProvider();
    if (ethereum == undefined)
        throw new Error('Cannot get metamask ethereum provider.');

    const account = (await metamaskSdk.connect())[0];

    console.log(account);

    const balance = fromWei(hexToNumber(await ethereum.request({
        method: "eth_getBalance", 
        params: [
            account,
            "latest"
        ] 
    }) as string), "ether");

    console.log(balance);

    metamask.auth(account, balance);
}

</script>