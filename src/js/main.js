email_address = document.getElementById('email-address');
fullname = document.getElementById('fullname');
phone_number = document.getElementById('phone-number');
date_of_birth = document.getElementById('date-of-birth');
customer_message = document.getElementById('customer-message');
main_form = document.getElementById('main-form');

var full_errors = {
    "email-address":"",
    "fullname":"",
    "phone-number": "",
    "date-of-birth": "",
    "customer-message":"",
    "address-country":""
};

// get the country data from the plugin
var countryData = window.intlTelInputGlobals.getCountryData(),
address_country = document.getElementById('address-country');

// init plugin
var iti = window.intlTelInput(phone_number, {
    utilsScript: "intl-tel-input-master/build/js/utils.js" // just for formatting/placeholders etc
});

// populate the country dropdown
for (var i = 0; i < countryData.length; i++) {
    var country = countryData[i];
    var optionNode = document.createElement("option");
    optionNode.value = country.iso2;
    var textNode = document.createTextNode(country.name);
    optionNode.appendChild(textNode);
    address_country.appendChild(optionNode);
}
// set it's initial value
address_country.value = iti.getSelectedCountryData().iso2;

    // Before using it we must add the parse and format functions
    // Here is a sample implementation using moment.js
    validate.extend(validate.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: function(value, options) {
        dateWrapper = new Date(value);
        return dateWrapper.getDate();
    },
    // Input is a unix timestamp
    format: function(value, options) {
        dateWrapper = new Date(value);
        return dateWrapper.getDate();
    }

});
  
var constraints = {
    "email-address": {
        presence: true,
        email: true
    },
    fullname: {
        // Password is also required
        presence: true,
        // And must be at least 3 characters long
        length: {
            minimum: 3
        },
        format: {
            // We don't allow anything other than a-z
            pattern: "[a-z. ]+",
            // but we don't care if the username is uppercase or lowercase
            flags: "i",
            message: "Please enter only alphabets in name field"
        }
    },
    "phone-number": {
        // You also need to input where you live
        presence: true,
        length: {
            minimum: 3
        }
    },
    "date-of-birth": {
        // You also need to input where you live
        presence: true,
        length: {
            minimum: 1
        },
        datetime: {
            message: "Please enter a valid date"
        }
    },
    "customer-message": {
        // You also need to input where you live
        presence: true,
        length: {
            minimum: 20,
            message: "Your message must be greater than 20 characters"
        }
    }, 
    "address-country": {
        // You also need to input where you live
        presence: true,
        length: {
            minimum: 1,
            message: "Please enter a valid country"
        }
    }    
};

function event_error(event) {
    errors = validate(main_form, constraints);
    check_error(event.path[0], errors);
}

function check_error(element, errors) {
    if(errors) {
        if(errors[element.id]) {
            is_error(element);
        }
        else {
            no_error(element);
        }
    }
    else {
        no_error(element);
    }
}

function no_error(element) {
    if(element.classList.contains("has-error")) {
        element.classList.remove("has-error");
    }
    if(!element.classList.contains("has-success")) {
        element.classList.add("has-success");
    }
}

function is_error(element) {
    if(!element.classList.contains("has-error")) {
        element.classList.add("has-error");
    }
    if(element.classList.contains("has-success")) {
        element.classList.remove("has-success");
    }
}

main_form.onsubmit = (event) => {
    errors = validate(main_form, constraints);
    var status = phone_status(phone_number, address_country);
    if(errors || status != "true") {
        event.preventDefault();
        Object.keys(errors).forEach((key) => {
            if(key == "phone-number") {
                set_phone_number_error(status);
                if(status != "true") {
                    full_errors[key] = ["Please enter a valid phone number"];
                }
            }
            else {
                item = document.getElementById(key);
                check_error(item, errors);
                full_errors[key] = errors[key];
            }
        });
    }
    console.log(full_errors);
};

// listen to the address dropdown for changes
address_country.onchange = (event) => {
    iti.setCountry(event.path[0].value);
    event_error(event);
};

date_of_birth.onchange = event_error;

date_of_birth.oninput = (event) => {
    date_of_birth.value  = "";
    event_error(event);
};

date_of_birth.onmousedown = event_error;

email_address.oninput = event_error

email_address.onmousedown = event_error

fullname.oninput = event_error;

fullname.onmousedown = event_error;

customer_message.onmousedown = event_error;

customer_message.oninput = event_error;

phone_number.onmousedown = phone_number_event;

phone_number.oninput = phone_number_event;

function phone_number_event(event) {
    status = phone_valid(phone_number, address_country);
    set_phone_number_error(status);
    
};

function set_phone_number_error(status) {
    if(status == "true") {
        no_error(phone_number);
    }
    else {
        is_error(phone_number);
    }
}

function  phone_status(number, country) {
    let parsedNumber
    let parseCountry = country.value.toUpperCase();
    let parseValue = number.value;
    try {
        parsedNumber = libphonenumber.parsePhoneNumberFromString(parseValue, parseCountry);
        return PhoneNumber(parsedNumber);
    }
    catch {
        return false;
    }
}
function phone_valid(phone_number, address_country) {
    var status = phone_status(phone_number, address_country);
    if(!status) {
        return false;
    }
    else {
        return status['Valid'];
    }
}
// listen to the telephone input for changes
phone_number.addEventListener('countrychange', function(event) {
    address_country.value = iti.getSelectedCountryData().iso2;
    // update_regex();
    event_error(event);
});

var picker = new Pikaday({
    field: document.getElementById('date-of-birth'),
    maxDate: new Date(),
    yearRange:150
});


function PhoneNumber(number) {
    const keyValues = {
        'Number': number.number,
        'Country': number.country || '—',
        'National': number.formatNational(),
        'International': number.formatInternational(),
        'URI': number.getURI(),
        'Type': number.getType() || '—',
        'Possible': number.isPossible() ? 'true' : 'false',
        'Valid': number.isValid() ? 'true' : 'false'
    }
    return keyValues;
}