(function () {
  emailjs.init("D7bi62LJHl40RijKO");
})();

function showFeedback(message, type = "success") {
  const feedback = document.getElementById("form-feedback");
  if (!feedback) return;

  // Applica gli stili iniziali per il div (solo la prima volta)
  if (!feedback.style.position) {
    feedback.style.position = "fixed";
    feedback.style.top = "0";
    feedback.style.left = "0";
    feedback.style.width = "100%";
    feedback.style.padding = "15px 0";
    feedback.style.textAlign = "center";
    feedback.style.fontWeight = "600";
    feedback.style.color = "white";
    feedback.style.zIndex = "9999";
    feedback.style.transform = "translateY(-100%)";
    feedback.style.transition = "transform 0.4s ease";
    feedback.style.display = "block";
  }

  // Cambia colore in base al tipo
  feedback.style.backgroundColor = (type === "error") ? "#e74c3c" : "#27ae60";

  // Imposta il testo
  feedback.textContent = message;

  // Forza il reflow per permettere la transizione (trick)
  void feedback.offsetWidth;

  // Fa scorrere la tendina verso il basso
  feedback.style.transform = "translateY(0)";

  // Dopo 4 secondi fa scorrere di nuovo verso l'alto e poi nasconde
  setTimeout(() => {
    feedback.style.transform = "translateY(-100%)";

    // Dopo la transizione (400ms) nasconde il div
    setTimeout(() => {
      feedback.style.display = "none";
    }, 400);
  }, 4000);
}

function sendMail(event) {
  event.preventDefault();

  const form = document.getElementById("contact-form");

  let parms = {
    name: document.getElementById("name").value.trim(),
    surname: document.getElementById("surname").value.trim(),
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  if (!validateEmail(parms.email)) {
    showFeedback("❌ Please enter a valid email!", "error");
    return;
  }

  showFeedback("🔄 Sending your message... Please wait.", "success");

  emailjs.send("service_ll9agc8", "template_7yknjyp", parms)
    .then(function (response) {
      showFeedback("✅ Message sent successfully!", "success");
      form.reset();
    })
    .catch(function (error) {
      console.error("FAILED...", error);
      showFeedback("❌ Something went wrong. Try again.", "error");
    });
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}
