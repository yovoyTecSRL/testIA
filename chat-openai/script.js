const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = input.value;
  appendMessage("Usuario", userText, "user");
  input.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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" // 👈 Cambia esto por tu API Key
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Sos un asistente amigable y útil." },
          { role: "user", content: userText }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    appendMessage("Asistente", reply, "assistant");
  } catch (error) {
    appendMessage("Asistente", "Ocurrió un error al conectar con GPT-4.", "assistant");
    console.error("Error:", error);
  }
});

function appendMessage(sender, text, className) {
  const message = document.createElement("div");
  message.className = "message " + className;
  message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}
