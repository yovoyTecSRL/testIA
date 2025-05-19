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
