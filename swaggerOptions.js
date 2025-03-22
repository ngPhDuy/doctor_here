const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Documentation for the backend API",
  },
  servers: [
    {
      url: "https://doctor-here-hya8gmh7drg9bdbf.southeastasia-01.azurewebsites.net/",
    },
    {
      url: "http://localhost:3001",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
