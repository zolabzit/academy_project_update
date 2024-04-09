document.getElementById("downloadResume").addEventListener("click", function () {
  const fullName = document.getElementById("fullName").value;

  if (fullName) {
    axios({
      method: 'get',
      url: `http://localhost:5000/api/downloadResume/${fullName}`,
      responseType: 'arraybuffer',
    })
      .then((response) => {
        const extension = 'pdf';
        const fileName = `${fullName.replace(/\s+/g, '_')}_Resume.${extension}`;
        const blob = new Blob([response.data], { type: `application/${extension}` });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
