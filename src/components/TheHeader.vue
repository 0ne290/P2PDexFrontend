<template>

<header class="header container-fluid border-bottom border-2 second-border-color">
    <div class="row h-100">
        <div class="col-3">
            <div class="row h-100">
                <div class="col p-0 d-flex justify-content-center align-items-center">
                    <span class="text-center">
                        <i class="fa-solid fa-right-to-bracket second-text-color fa-2xl"></i><br/>
                        Login Metamask
                    </span>
                </div>
                <div class="col border-start border-2 second-border-color d-flex justify-content-center align-items-center">
                    <span class="text-center">Metamask balance</span>
                </div>
            </div>
        </div>
        <div class="col-6 border-start border-end border-2 second-border-color">v</div>
        <div class="col-3">
            <div class="row h-100">
                <div class="col p-0 d-flex justify-content-center align-items-center">
                    <span class="text-center">Telegram tag</span>
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

const telegramAuthCallback = document.createElement("script");
telegramAuthCallback.setAttribute(
    "type",
    "text/javascript"
);
telegramAuthCallback.text = `
    const apiUrl = "https://localhost/api";

    async function onTelegramAuth(user) {
        const response = await fetch(\`\${apiUrl}/ensure-existed-of-trader/\${user.id}\`, {
            method: "GET",
            mode: "cors"
        });

        if (response.status != 200) {
            throw new Error("Unexpected error.");
        }

        console.log(\`Status: \${response.status}\nBody: \${response.text()}\`)
    }
`;

const telegramAuthDiv = useTemplateRef('telegram-auth-div');

onMounted(() => {
    if (telegramAuthDiv.value == null) {
        throw new Error("Unexpected error.");
    }

    telegramAuthDiv.value.appendChild(telegramAuthButton);
    telegramAuthDiv.value.appendChild(telegramAuthCallback);
});

</script>