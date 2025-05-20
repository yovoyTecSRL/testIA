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
