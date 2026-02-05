function goHome() {
  window.location.href = "index.html";
}

const statusMsg = document.getElementById("statusMsg");

const params = new URLSearchParams(window.location.search);
const exam = params.get("exam");
const roll = params.get("roll");

// If URL params missing
if (!exam || !roll) {
  statusMsg.textContent = "Result details not provided.";
} else {
  fetch(
    `http://127.0.0.1:5000/result?exam=${encodeURIComponent(exam)}&roll=${encodeURIComponent(roll)}`
  )
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        statusMsg.textContent = data.error;
        return;
      }

      // ---------- BASIC INFO ----------
      statusMsg.style.display = "none";

      document.getElementById("examName").textContent =
        data.exam.replaceAll("_", " ");

      document.getElementById("rName").textContent =
        data.candidate.name;

      document.getElementById("rRoll").textContent =
        data.candidate.roll;

      // ---------- SUBJECT TABLE ----------
      const tbody = document.getElementById("subjectTableBody");
      tbody.innerHTML = "";

      data.subjects.forEach(sub => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${sub.name}</td>
          <td>${sub.attempt}</td>
          <td>${sub.na}</td>
          <td>${sub.right}</td>
          <td>${sub.wrong}</td>
          <td>${sub.marks}</td>
        `;
        tbody.appendChild(tr);
      });

      // ---------- OVERALL ROW ----------
      const overall = document.createElement("tr");
      overall.style.background = "#6366f1";
      overall.style.color = "white";
      overall.style.fontWeight = "bold";

      overall.innerHTML = `
        <td>Overall</td>
        <td>${data.overall.attempt}</td>
        <td>${data.overall.na}</td>
        <td>${data.overall.right}</td>
        <td>${data.overall.wrong}</td>
        <td>${data.overall.marks}</td>
      `;

      tbody.appendChild(overall);
    })
    .catch(err => {
      console.error(err);
      statusMsg.textContent =
        "Result not available yet. Please try again later.";
    });
}
