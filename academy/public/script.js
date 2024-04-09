// script.js
$(document).ready(function () {
  $("#submit-btn").click(function () {
    const name = $("#name").val();
    const email = $("#email").val();
    const phone = $("#phone").val();

    $.ajax({
      type: "POST",
      url: "http://localhost:5000/api/freereg",
      contentType: "application/json",
      data: JSON.stringify({ name, email, phone }),
      success: function (data) {
        alert("Submission saved successfully.");
        // You can redirect or perform any other action here
      },
      error: function (error) {
        console.error("Failed to save the submission:", error);
        alert("Failed to save the submission. Please try again.");
      }
    });
  });

  $("#internshipApplicationForm").submit(function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    axios.post("http://localhost:5000/api/internship", formData)
      .then((response) => {
        console.log(response.data);
        const successMessage = $("#successMessage");
        successMessage.text("Your application submitted successfully!");
        form.reset();
      })
      .catch((error) => {
        console.error("Error submitting application:", error);
        alert("Failed to submit the application. Please try again.");
      });
  });

  $("#downloadResume").click(function () {
    const fullName = $("#fullName").val();

    if (fullName) {
      downloadResume(fullName);
    } else {
      alert('Please enter a full name.');
    }
  });

  fetchInternshipRecords();

  function fetchInternshipRecords() {
    axios.get("http://localhost:5000/api/internship/all")
      .then(response => {
        console.log('Fetched Records:', response.data);

        // Process and display fetched data in your HTML
      })
      .catch(error => {
        console.error("Failed to fetch internship records:", error);
      });
  }

  function formatDate(dateString) {
    if (!dateString) return ''; // Return an empty string if the date is not provided
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  function downloadResume(fullName) {
    fetch(`http://localhost:5000/api/resume/${encodeURIComponent(fullName)}`)
      .then(response => {
        if (!response.ok) {
          console.error('Response Status:', response.status);
          console.error('Response Text:', response.statusText);
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `resume_${fullName}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        alert('Error downloading resume. Please check the provided name or try again later.');
      });
  }
});
