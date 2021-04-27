const seeder = require('mongoose-seed');
require("dotenv").config();
const DB = require('../config/config')

console.log(DB)
// Connect to MongoDB via Mongoose
seeder.connect(DB, function() {
 
  // Load Mongoose models
  seeder.loadModels([
    './models/role',
  ]);
 
  // Clear specified collections
  seeder.clearModels(['Role'], function() {
 
    // Callback to populate DB once collections have been cleared
     seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});

const data = [
    {
        'model': 'Role',
        'documents': [
            {
                'role': 'super-admin',
            },
            {
                'role': 'admin',
            },
            {
                'role': 'user',
            },
        ]
    }
];