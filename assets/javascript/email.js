


  console.log("script caricato correttamente");
  (function () {
    emailjs.init("D7bi62LJHl40RijKO");
  })();
  function sendMail(event) {
    event.preventDefault();
  
    let parms = {
      name: document.getElementById("name").value.trim(),
      surname: document.getElementById("surname").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
    };
  
  
    if (!validateEmail(parms.email)) {
      alert("❌ Please enter a valid email!");
      return;
    }
  
    emailjs.send("service_ll9agc8", "template_7yknjyp", parms)
      .then(function (response) {
        alert("✅ Message sent! You will receive a reply as soon as possible.");
        console.log("SUCCESS!", response.status, response.text);
      })
      .catch(function (error) {
        alert("❌ Error during submission. Check the console for more details.");
        console.error("FAILED...", error);
      });
  }
  
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }


