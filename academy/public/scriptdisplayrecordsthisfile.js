$(document).ready(function () {
  // Handle form submission using jQuery
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

  // Handle internship application form submission using Axios
  $("#internshipApplicationForm").submit(function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    axios
      .post("http://localhost:5000/api/internship", formData)
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

  // Handle download resume button click
  $("#downloadResume").click(function () {
    const fullName = $("#fullName").val();

    if (fullName) {
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
    } else {
      alert('Please enter a full name.');
    }
  });

  // Fetch internship records when the page loads
  fetchInternshipRecords();

  // Function to fetch internship records and populate the table
  function fetchInternshipRecords() {
    axios.get("http://localhost:5000/api/internship/all")
      .then(response => {
        const records = response.data;
        const tableBody = $("#internshipTable tbody");
        tableBody.empty();

        records.forEach(record => {
          const row = $("<tr>");
          $("<td>").text(record.full_name).appendTo(row);
          $("<td>").text(record.email).appendTo(row);
          $("<td>").text(record.phone).appendTo(row);
          // Add additional cells/columns as needed
          tableBody.append(row);
        });
      })
      .catch(error => {
        console.error("Failed to fetch internship records:", error);
      });
  }

  // Add any additional event listeners or functions here
});
