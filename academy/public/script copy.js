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
});
