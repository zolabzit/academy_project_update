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
      downloadResume(fullName);
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
        console.log('Fetched Records:', response.data);  // Add this line

        const records = response.data;
        const tableBody = $("#internshipTable tbody");
        tableBody.empty();

        records.forEach(record => {
          const row = $("<tr>");
          $("<td>").text(record.full_name).appendTo(row);
          $("<td>").text(record.email).appendTo(row);
          $("<td>").text(record.phone).appendTo(row);

          // Display the photo
          if (record.photo_url) {
            row.append($('<td>').append($('<img>').attr('src', record.photo_url).attr('alt', 'Internship Photo').css('max-width', '100px')));
          } else {
            row.append($('<td>').text('No Photo'));
          }

          // Add download button to the row
          const downloadButton = $("<button>").text("Download Resume").click(function () {
            downloadResume(record.full_name);
          });
          $("<td>").append(downloadButton).appendTo(row);

          tableBody.append(row);
        });
      })
      .catch(error => {
        console.error("Failed to fetch internship records:", error);
      });
  }
  // Function to download resume
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
        // Create a link element and trigger the download with a generic name
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
