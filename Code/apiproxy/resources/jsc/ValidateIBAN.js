function validateIBANformat(iban) {
  // Validar longitud
  if (iban.length > 34) {
    return false;
  }

  // Validar código de país
  const countryCode = iban.substring(0, 2);
  if (!["AD", "AL", "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK","AZ","BH","BA","BR","VG","CR","DO","SV","FO","GE","GI","GL","GT","IQ","IS","IL","JO","KZ","QA","XK","KW","LB","LI","MR","MU","MK","MD","MC","ME","NO","PK","PS","LC","SM","ST","SA","CH","RS","SC","TL","TR","TN","UA","AE","BY"].includes(countryCode)) {
    return false;
  }

  return true;
}

//Funcion para validar el dígito de control
function isValidControlDigit(iban) {
    // Remove spaces and convert to uppercase
    iban = iban.replace(/\s+/g, '').toUpperCase();

    // Check if the IBAN length is valid
    if (iban.length < 4 || iban.length > 34) {
        return false;
    }

    // Move the first four characters to the end
    iban = iban.substring(4) + iban.substring(0, 4);

    // Convert letters to numbers (A=10, B=11, ..., Z=35)
    var ibanNumeric = '';
    for (var i = 0; i < iban.length; i++) {
        var charCode = iban.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            ibanNumeric += (charCode - 55).toString();
        } else {
            ibanNumeric += iban[i];
        }
    }

    // Perform the MOD-97-10 algorithm without BigInt
    var remainder = 0;
    for (var j = 0; j < ibanNumeric.length; j++) {
        remainder = (remainder * 10 + parseInt(ibanNumeric[j], 10)) % 97;
    }

    // If the remainder is 1, the IBAN is valid
    return remainder === 1;
}


// Get IBAN from request
var requestBody = JSON.parse(context.getVariable("request.content"));
var iban = requestBody.iban;

// Validate IBAN
if (iban == null) {
    // IBAN is valid
    var responseJson = {
        "RESULT": "KO",
        "ERROR_MESSAGE": "IBAN code required."
    };
} else if(!validateIBANformat(iban)){
    // IBAN is invalid
    var responseJson = {
        "RESULT": "KO",
        "ERROR_MESSAGE": "The IBAN format is not correct."
    };
} else if(!isValidControlDigit(iban)){
    var responseJson = {
        "RESULT": "KO",
        "ERROR_MESSAGE": "The check digit is not correct."
    };
}
else{
    var responseJson = {
        "RESULT": "OK",
        "ERROR_MESSAGE": ""
    };
}

// Set JSON response in the response flow
context.setVariable("response.content", JSON.stringify(responseJson));