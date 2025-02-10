<template>

    <header class="header container-fluid border-bottom border-2 second-border-color">
        <div class="row h-100">
            <div class="col-3">
                <div class="row h-100">
                    <div class="col p-0 d-flex justify-content-center align-items-center">
                        <span class="text-center">
                            <i class="fa-solid fa-right-to-bracket second-text-color fa-2xl"
                                @click="metamask.auth"></i><br />
                            Authenticate in Metamask
                        </span>
                    </div>
                    <div
                        class="col border-start border-2 second-border-color d-flex justify-content-center align-items-center">
                        <span class="text-center" v-if="metamask.isAuth">{{ metamask.walletBalance }} ETH</span>
                        <span class="text-center" v-else>Please authenticate in Metamask.</span>
                    </div>
                </div>
            </div>
            <div
                class="col-6 border-start border-end border-2 second-border-color d-flex justify-content-around align-items-center">
                <template v-if="telegram.isAuth && metamask.isAuth">
                    <RouterLink to="/sell-order/get-all" custom v-slot="{ navigate }">
                        <div role="button" @click="navigate"
                            class="second-text-color second-border-color border rounded-pill px-3 py-1">
                            Sell orders
                        </div>
                    </RouterLink>
                    <RouterLink to="/sell-order/create" custom v-slot="{ navigate }">
                        <div role="button" @click="navigate"
                            class="second-text-color second-border-color border rounded-pill px-3 py-1">
                            Create sell order
                        </div>
                    </RouterLink>
                </template>
                <span class="text-center" v-else>Authentication in Telegram and Metamask failed, access to tabs is
                    closed.</span>
            </div>
            <div class="col-3">
                <div class="row h-100">
                    <div class="col p-0 d-flex justify-content-center align-items-center">
                        <span class="text-center" v-if="telegram.isAuth">{{ telegram.userName == null ? telegram.userId : `${telegram.userId}, ${telegram.userName}` }}</span>
                        <span class="text-center" v-else>Please authenticate in Telegram.</span>
                    </div>
                    <div ref="telegram-auth-div"
                        class="col border-start border-2 second-border-color d-flex justify-content-center align-items-center">
                    </div>
                </div>
            </div>
        </div>
    </header>

</template>

<script setup lang="ts">

import { useTemplateRef, onMounted } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { useMetamaskStore } from '@/stores/metamask'
import { ensureExistedOfTrader } from '@/services/apiService'
import { sendMessage } from '@/services/telegramService'

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
    telegram.auth(user.id, user.username === undefined ? null : `@${user.username}`);

    await ensureExistedOfTrader();

    await sendMessage('Вы аутентифицировались в P2P DEX.');
}

const telegramAuthDiv = useTemplateRef('telegram-auth-div');

onMounted(() => {
    if (telegramAuthDiv.value == null) {
        throw new Error("Unexpected error.");
    }

    telegramAuthDiv.value.appendChild(telegramAuthButton);
});

</script>