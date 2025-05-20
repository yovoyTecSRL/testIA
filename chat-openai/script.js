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
