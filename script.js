let conversationStarted = false;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (message === "") return;

    addMessage(message, "user");
    input.value = "";

    try {
        const response = await fetch('https://chatboat-catarinos.vercel.app/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                conversation_started: conversationStarted
            }),
        });

        if (!response.ok) throw new Error('Falha na comunicação com o servidor.');

        const data = await response.json();

        const botReplies = data.replies;

        for (const reply of botReplies) {
            addMessage(reply, "bot");
            await sleep(600);
        }

        conversationStarted = true;

    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        addMessage("Desculpe, estou com problemas para me conectar", "bot");
    }
}

function addMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.style.whiteSpace = 'pre-wrap';
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.querySelector("button").addEventListener("click", sendMessage);

document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

window.addEventListener('load', () => {
    addMessage('Olá!', 'bot');
});