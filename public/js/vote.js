console.log("Script de votos carregado!");

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".ideaCard").forEach(card => {
    const ideaId = card.dataset.id;
    const likeBtn = card.querySelector(".like");
    const dislikeBtn = card.querySelector(".dislike");
    const voteCount = card.querySelector(".voteCount");

    async function sendVote(type) {
      try {
        const res = await fetch(`/votes/${ideaId}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });

        const data = await res.json();
        if (data.success) {
          voteCount.textContent = `👍 ${data.likeCount} | 👎 ${data.dislikeCount}`;
        } else {
          alert(data.message || "Erro ao votar");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao enviar voto");
      }
    }

    likeBtn.addEventListener("click", () => sendVote("like"));
    dislikeBtn.addEventListener("click", () => sendVote("dislike"));
  });
});
