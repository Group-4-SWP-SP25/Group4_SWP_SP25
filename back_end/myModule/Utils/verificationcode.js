const verificationCodes = {};

const generateVerificationCode = (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[email] = {
    code: code,
    expires: Date.now() + 10 * 60 * 1000 // Mã hết hạn sau 10 phút
  };
  return code;
};

const getVerificationCode = (email) => {
  return verificationCodes[email];
};

module.exports = { generateVerificationCode, getVerificationCode };
