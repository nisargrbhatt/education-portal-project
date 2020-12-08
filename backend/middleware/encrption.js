const CryptoJS = require("crypto-js");

exports.encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.SECRET
    ).toString();
  } catch (e) {
    console.log(e);
  }
};

exports.decryptData = (data) => {
  try {
    const bytes = CryptoJS.AES.decrypt(data, process.env.SECRET);
    console.log(bytes);
    if (bytes.toString()) {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return data;
  } catch (e) {
    console.log(e);
  }
};
