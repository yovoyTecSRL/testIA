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
        "Authorization": "Bearer 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"
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
