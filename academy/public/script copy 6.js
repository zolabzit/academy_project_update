document.getElementById("downloadResume").addEventListener("click", function () {
  const fullName = document.getElementById("fullName").value;

  if (fullName) {
    // Use an AJAX request to download the file
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:5000/api/downloadResume/${encodeURIComponent(fullName)}`, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      if (xhr.status === 200) {
        // Create a blob from the response
        const blob = new Blob([xhr.response], { type: 'application/octet-stream' });

        // Create a link element and trigger the download with a generic name
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'resume.docx';  // Use a generic name for the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error(xhr.statusText);
        alert('Error downloading resume. Please check the provided name.');
      }
    };

    xhr.send();
  } else {
    alert('Please enter a full name.');
  }
});
