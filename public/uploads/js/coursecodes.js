// coursecodes.js
$(document).ready(function () {
    $("#courseCodeSelect").select2({
      placeholder: "Select Course Code",
      data: [],
    });
  
    // Fetch unique course codes and populate the select2 dropdown
    fetch("/getUniqueCourseCodes")
      .then((response) => response.json())
      .then((data) => {
        $("#courseCodeSelect").select2({
          data: data.map((course) => ({ id: course, text: course })),
        });
      })
      .catch((error) => {
        console.error("Error fetching course codes:", error);
      });
  });
  