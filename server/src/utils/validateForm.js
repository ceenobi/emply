export const validateEmail = (email) => {
  var validRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!email) {
    return "Email is required.";
  } else if (!validRegex.test(email)) {
    return "Please enter a valid email address";
  }
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required.";
  } else if (password.length < 5) {
    return "Please enter a password that is at least 5 characters long";
  }
};

export const validateFirstName = (firstName) => {
  if (!firstName) {
    return "FirstName is required.";
  }
};
export const validateLastName = (lastName) => {
  if (!lastName) {
    return "LastName is required.";
  }
};
export const validatePhone = (phone) => {
  const validPhone =
    /^(\+234|234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|909|908|901|902|903|904|905|906|907)([0-9]{7})$/;
  if (!phone) {
    return "Phone number is required.";
  } else if (!validPhone.test(phone)) {
    return "Please enter a valid phone number";
  }
};
export const validateDepartment = (dept) => {
  if (!dept) {
    return "Please select a department";
  }
};
export const validateRole = (role) => {
  if (!role) {
    return "Please select a role";
  }
};

export const validateField = (fieldName, msg) => {
  if (!fieldName) {
    return msg;
  }
};
