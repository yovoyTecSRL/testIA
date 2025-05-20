const form = document.getElementById("promptForm");
const input = document.getElementById("promptInput");
const loading = document.getElementById("loading");
const image = document.getElementById("generatedImage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const prompt = input.value;
  loading.style.display = "block";
  image.style.display = "none";

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      })
    });

    const data = await response.json();
    const imageUrl = data.data[0].url;
    image.src = imageUrl;
    image.style.display = "block";
  } catch (error) {
    alert("Error al generar la imagen");
    console.error(error);
  } finally {
    loading.style.display = "none";
  }
});
