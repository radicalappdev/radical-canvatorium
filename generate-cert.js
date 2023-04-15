const fs = require("fs");
const { promisify } = require("util");
const { createCertificate } = require("tls");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const options = {
  key: null,
  cert: null
};

const generateCertificate = async () => {
  const { privateKey, certificate } = await createCertificate({
    days: 365,
    selfSigned: true
  });

  options.key = privateKey;
  options.cert = certificate;

  await Promise.all([writeFile("key.pem", privateKey), writeFile("cert.pem", certificate)]);

  console.log("SSL certificate and key generated successfully!");
};

const checkCertificate = async () => {
  try {
    await Promise.all([readFile("key.pem"), readFile("cert.pem")]);
    console.log("SSL certificate and key found.");
  } catch (err) {
    console.log("SSL certificate and key not found. Generating new ones...");
    await generateCertificate();
  }
};

checkCertificate();

module.exports = options;
