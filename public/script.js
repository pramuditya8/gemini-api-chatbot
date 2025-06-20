const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";

  setTimeout(() => {
    appendMessage("bot-thinking", "Gemini is thinking...");
  });

  fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      appendMessage("bot", data.reply);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      appendMessage("bot", "Error: Could not get a response.");
    })
    .finally(() => {
      removeMessageBotThinking();
    });
});

function appendMessage(sender, text) {
  const msgWrapper = document.createElement("div");
  msgWrapper.classList.add(`message-wrapper`, sender);

  const msg = document.createElement("div");
  if (sender === "bot-thinking") {
    msg.classList.add("message", "bot", sender);
  } else {
    msg.classList.add("message", sender);
  }
  msg.textContent = text;

  msgWrapper.appendChild(msg);

  chatBox.appendChild(msgWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeMessageBotThinking() {
  const msg = document.getElementsByClassName(`bot-thinking`);
  chatBox.removeChild(msg[0]);
}
