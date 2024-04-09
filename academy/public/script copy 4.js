// script.js

document.addEventListener("DOMContentLoaded", function () {
  const internshipForm = document.getElementById("internshipApplicationForm");
  const downloadButton = document.getElementById("downloadResume");

  // Disable the download button initially
  downloadButton.disabled = true;

  // Event listener for the resume file input
  document.getElementById("resume").addEventListener("change", function () {
    const resumeInput = this;
    const fileName = resumeInput.value.split("\\").pop();
    downloadButton.disabled = fileName ? false : true;
  });

  // Event listener for the form submission
  internshipForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    axios
      .post("http://localhost:5000/api/internship", formData)
      .then((response) => {
        console.log(response.data);
        const successMessage = document.getElementById("successMessage");
        successMessage.innerText = "Your application submitted successfully!";
        form.reset();
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
