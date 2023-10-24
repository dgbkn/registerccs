addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400", // optional
  "Access-Control-Allow-Headers": "Content-Type",
};

function isValidGoogleDriveLink(link) {
    // Regular expression to match Google Drive links
    const regex = /https:\/\/drive\.google\.com\/.*(\?id=|\/folders\/|\/file\/d\/)([a-zA-Z0-9_-]+)/;
  
    return regex.test(link);
  }

function standardizePhoneNumber(phoneNumber) {
  // Remove "+" and "91" if present
  phoneNumber = phoneNumber.replace(/\+|91/g, "");

  // Add "+91" prefix
  // phoneNumber = '+91' + phoneNumber;

  return phoneNumber;
}

function isValidIndianPhoneNumber(phoneNumber) {
  // Regular expression for Indian phone numbers with or without "+91" country code
  const regex = /^(?:\+91|91)?[0-9]{10}$/;

  return regex.test(phoneNumber);
}

function isCommaSeparated(str) {
  // Define a regular expression to match a comma-separated string
  const regex = /^(\s*\w+\s*,\s*)*\s*\w+\s*$/;

  // Test if the string matches the pattern
  return regex.test(str);
}

async function handleRequest(request) {
  try {
    // Check if the request method is POST
    if (request.method === "POST") {
      const formData = await request.formData();

      // Access the submitted form data
      const entry1 = formData.get("teamName");
      const entry2 = formData.get("leaderName");
      const entry3 = formData.get("leaderEmail");
      var entry4 = formData.get("leaderPhone");
      const entry5 = formData.get("leaderUsername");
      const entry6 = formData.get("m1");
      const entry7 = formData.get("m2");
      const entry8 = formData.get("m3");
      const entry9 = formData.get("ss");

      if (!entry3.includes("@thapar.edu")) {
        const errorResponse = {
          error: "Thapar Email Not Correct use @thapar.edu",
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      if (isValidIndianPhoneNumber(entry4)) {
        // Standardize the phone number
        entry4 = standardizePhoneNumber(entry4);
      } else {
        const errorResponse = {
          error: "Invalid phone number",
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      // if (!isValidGoogleDriveLink(entry9)) {
      //   const errorResponse = {
      //     error: "Invalid Google Drive link",
      //   };
      //   return new Response(JSON.stringify(errorResponse), {
      //     status: 200,
      //     headers: {
      //       "Content-Type": "application/json",
      //       ...corsHeaders,
      //     },
      //   });
      // }

      // if (
      //   !entry1 ||
      //   !entry2 ||
      //   !entry3 ||
      //   !entry4 ||
      //   !entry5 ||
      //   !entry6 ||
      //   !entry7 ||
      //   !entry8 
      // ) {
      //   const errorResponse = {
      //     error: "Please fill all the fields",
      //   };
      //   return new Response(JSON.stringify(errorResponse), {
      //     status: 200,
      //     headers: {
      //       "Content-Type": "application/json",
      //       ...corsHeaders,
      //     },
      //   });
      // }

      // Submit the incoming data to an external Google Form
      await submitToGoogleForm(
        entry1,
        entry2,
        entry3,
        entry4,
        entry5,
        entry6,
        entry7,
        entry8,
        entry9
      );

      const successResponse = {
        success: "Form data received and submitted successfully",
      };
      return new Response(JSON.stringify(successResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } else {
      // Handle other HTTP methods
      const errorResponse = {
        error: "Only POST requests are supported",
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  } catch (error) {
    // Handle errors
    const errorResponse = {
      error: `Error: ${error.message}`,
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

async function submitToGoogleForm(
  entry1,
  entry2,
  entry3,
  entry4,
  entry5,
  entry6,
  entry7,
  entry8,
  entry9
) {
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScniw97Al8EQ877ftJpYCYjIvHP0eBNJiomb4HZN26hzea9Sg/formResponse";

  const formData = new FormData();
  formData.append("entry.1616276106", entry1);
  formData.append("entry.250567223", entry2);
  formData.append("entry.69288950", entry3);
  formData.append("entry.1310683687", entry4);
  formData.append("entry.902703164", entry5);
  formData.append("entry.1055446366", entry6);
  formData.append("entry.260884549", entry7);
  formData.append("entry.2025418434", entry8);
  formData.append("entry.93291268", entry9);

  const response = await fetch(formUrl, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    console.log("Form data submitted successfully to the external Google Form");
  } else {
    throw new Error("Failed to submit data to the external Google Form");
  }
}
