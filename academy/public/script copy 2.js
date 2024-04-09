// script.js

// Add any client-side logic here
// You can handle form validation, additional UI interactions, etc.

document.getElementById("internshipApplicationForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  axios
    .post("http://localhost:5000/api/internship", formObject)
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
