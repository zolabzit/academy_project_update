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
              console.error(error);
              alert("Failed to save the submission.");
          }
      });
  });

  document.getElementById("internshipApplicationForm").addEventListener("submit", function (event) {
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
              console.error("Error submitting application:", error);
          });
  });
});


document.getElementById("downloadResume").addEventListener("click", function () {
  const fullName = document.getElementById("fullName").value;
  console.log('Full Name:', fullName);

  if (fullName) {
    // Use the fetch API to download the file
    fetch(`http://localhost:5000/api/resume/${encodeURIComponent(fullName)}`)
      .then(response => {
        if (!response.ok) {
          // Log the response details for debugging
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
        // Log the full error object for debugging
        console.error('Fetch Error:', error);
        alert('Error downloading resume. Please check the provided name or try again later.');
      });
  } else {
    alert('Please enter a full name.');
  }
});
