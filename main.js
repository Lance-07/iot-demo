/* 
 1. Get the elements we need to interact with.
 2. Add event listener to the elements.
 3. Upload and deploy in github pages.
 4. Create a function for sending / connecting the data to server thru http methods and socket io.
    # Buttons - POST
    # Bucket - socket io ('water_status')
    # Form input - POST
    # LCD Display - socket io ('lcd-status')
 5. Connect to socket io server (https://modern-snake-evenly.ngrok-free.app)
*/

const lcdInput = document.querySelector("input");
const charCount = document.querySelector(".char-count");
const ledButtons = document.querySelectorAll(".led-button");
const lcdForm = document.querySelector(".lcd-form");
const bucket = document.querySelector(".bucket");
const lcdDisplay = document.querySelector(".lcd-display");
const lcdTexts = document.querySelectorAll(".lcd-text");

const socket = io("https://modern-snake-evenly.ngrok-free.app", {
  cors: { origin: "https://lance-07.github.io/iot-demo" },
  extraHeaders: { "ngrok-skip-browser-warning": "true" },
});

ledButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let isActive = button.getAttribute("data-active") === "true";
    const ledData = button.getAttribute("data-led");

    if (isActive) {
      button.setAttribute("data-active", "false");
    } else {
      button.setAttribute("data-active", "true");
    }
    sendLEDData(ledData);
  });
});

function sendLEDData(data) {
  fetch("https://modern-snake-evenly.ngrok-free.app/led", {
    method: "POST",
    headers: { "ngrok-skip-browser-warning": "true" },
    body: JSON.stringify({ led: data }),
  });
}

lcdInput.setAttribute("size", lcdInput.getAttribute("placeholder").length);
lcdInput.addEventListener("input", updateCharCount);

function updateCharCount() {
  const currentLength = lcdInput.value.length;
  const maxLength = lcdInput.maxLength;
  charCount.textContent = `${currentLength}/${maxLength}`;
}

lcdForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = String(lcdInput.value.trim());

  fetch("https://modern-snake-evenly.ngrok-free.app/text", {
    method: "POST",
    headers: { "ngrok-skip-browser-warning": "true" },
    body: JSON.stringify({ text: value }),
  })
    .then((response) => {
      if (response.ok) {
        lcdInput.value = "";
        updateCharCount();
        alert("Text sent successfully!");
      } else {
        throw new Error("Failed to send text");
      }
    })
    .catch((error) => {
      alert("Failed to send text: " + error.message);
    });
});

socket.on("water_status", (data) => {
  let status = Number(data.split(": ")[1]);

  console.log(data);
  if (status == 1) {
    bucket.classList.remove("empty");

    void bucket.offsetWidth;
    bucket.classList.add("filled");
  } else {
    bucket.classList.remove("filled");

    void bucket.offsetWidth;
    bucket.classList.add("empty");
  }
});

socket.on("lcd-status", (data) => {
  const texts = data["texts"];

  console.log(texts);

  if (!Array.isArray(texts)) return;

  for (let i = 0; i < 4; i++) {
    const text = texts[3 - i] || "&nbsp;";
    lcdTexts[3 - i].innerHTML = text;
  }
});
