export const generatePassword = (length, options) => {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = false,
    includeSymbols = false,
    excludeAmbiguous = true,
  } = options;

  let charset = "";
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  if (excludeAmbiguous) {
    // Remove i, l, 1, o, 0, I, L, O
    charset = charset.replace(/[il1o0ILO]/g, "");
  }

  if (charset === "") return "";

  let password = "";
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
};
