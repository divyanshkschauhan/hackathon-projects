window.onload = function () {

    function subjects(subject) {
        q1.style.display = "none";
        s1.style.display = "block";
        document.querySelector('.subname').textContent = subject;
        p1.style.display = "none";
        af1.style.display="none";

    }
    function backq1() {
        q1.style.display = "flex";
        s1.style.display = "none";
        p1.style.display = "none";
        af1.style.display="none";

    }

    function dashboard() {
        q1.style.display = "none";
        p1.style.display = "none";
        d1.style.display = "flex";
        b1.style.display = "none";
        af1.style.display="none";

    }
    function sub() {
        q1.style.display = "flex";
        s1.style.display = "none";
        p1.style.display = "none";
        af1.style.display="none";

    }

    function pdfs() {
        q1.style.display = "none";
        p1.style.display = "flex";
        af1.style.display="none";

    }
    window.subjects = subjects;
    window.backq1 = backq1;
    window.pdfs = pdfs;
    window.dashboard = dashboard;
    window.sub = sub;


    let borefill = document.getElementById('borefill');
    let notification = document.getElementById('popup');

    let totaltime = 120;
    let interval = setInterval(fillbom, 1000);
    let timepassed = 0;

    function fillbom() {
        timepassed++;
        let percentage = (timepassed / totaltime) * 100;
        borefill.style.height = percentage + "%";
        console.log(borefill.style.height);

        if (timepassed === totaltime) {
            clearInterval(interval);
            notification.innerHTML = "Bore-o-meter is full! Time for a break!";
        }
    }

    function basic() {
        console.log("dgfj");
        s1.style.display = "none";
        b1.style.display = "flex";
        d1.style.display = " none";
    }
    function Customised() {
        s1.style.display = "none";
        a1.style.display = "flex";
    }
    window.basic = basic;
    windoow.Customised = Customised;

};

const form = document.getElementById("inputbox");
const loader = document.getElementById("loader");
const summaryContainer = document.getElementById("summary-container");
const summaryText = document.getElementById("summary-text");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const fileInput = document.getElementById("file");

  formData.append("pdf", fileInput.files[0]);

  // Show the loader when form is submitted
  loader.style.display = "block";

  try {
    // Send the PDF file and summary length to the backend for summarization
    const response = await fetch("http://127.0.0.1:5000/summarize", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to summarize the PDF");
    }

    const result = await response.json();
    loader.style.display = "none"; // Hide loader once response is received

    if (result.summary) {
      summaryText.textContent = result.summary;
      summaryContainer.style.display = "block";
      gsap.from("#summary-container", {
        duration: 1,
        opacity: 0,
        y: 50,
        ease: "power2.out",
      });
    } else {
      summaryText.textContent = "Failed to generate summary.";
    }
  } catch (error) {
    loader.style.display = "none"; // Hide loader in case of error
    alert("Error: " + error.message); // Provide better feedback
  }
});

