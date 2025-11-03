const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MedTechAI API',
      version: '2.0.0',
      description: 'Comprehensive healthcare management platform API documentation',
      contact: {
        name: 'MedTechAI Support',
        email: 'contact@medtechai.net',
        url: 'https://medtechai.net'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.medtechai.net',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Pharmacy',
        description: 'Pharmacy management and operations'
      },
      {
        name: 'Consultations',
        description: 'Telemedicine consultation management'
      },
      {
        name: 'AI Services',
        description: 'AI-powered medical services'
      },
      {
        name: 'FDA',
        description: 'FDA drug database integration'
      },
      {
        name: 'POS',
        description: 'Point of Sale system operations'
      },
      {
        name: 'Health',
        description: 'Health check and system status'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        },
        oauth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
              tokenUrl: 'https://oauth2.googleapis.com/token',
              scopes: {
                'openid': 'OpenID Connect scope',
                'profile': 'Profile information',
                'email': 'Email address'
              }
            }
          }
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            role: {
              type: 'string',
              enum: ['admin', 'pharmacist', 'doctor', 'patient'],
              description: 'User role'
            },
            firstName: {
              type: 'string',
              description: 'First name'
            },
            lastName: {
              type: 'string',
              description: 'Last name'
            },
            licenseNumber: {
              type: 'string',
              description: 'License number (for professionals)'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Password'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT authentication token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Prescription: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            patientId: {
              type: 'string',
              format: 'uuid'
            },
            medicationId: {
              type: 'string',
              format: 'uuid'
            },
            quantity: {
              type: 'integer'
            },
            daysSupply: {
              type: 'integer'
            },
            directions: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['pending', 'filled', 'cancelled', 'expired']
            },
            datePrescribed: {
              type: 'string',
              format: 'date'
            }
          }
        },
        Medication: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string'
            },
            genericName: {
              type: 'string'
            },
            strength: {
              type: 'string'
            },
            dosageForm: {
              type: 'string'
            },
            manufacturer: {
              type: 'string'
            }
          }
        },
        AIAnalysis: {
          type: 'object',
          properties: {
            summary: {
              type: 'string',
              description: 'Analysis summary'
            },
            findings: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            recommendations: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            ai_powered: {
              type: 'boolean'
            },
            confidence: {
              type: 'number',
              format: 'float'
            }
          }
        }
      }
    }
  },
  apis: [
    './routes/*.js',
    './server.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

