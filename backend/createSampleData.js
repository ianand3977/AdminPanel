const sequelize = require('./config/db'); // Adjust the path as necessary
const Role = require('./models/roleModel')(sequelize, require('sequelize').DataTypes);
const User = require('./models/userModel')(sequelize, require('sequelize').DataTypes);

const createSampleData = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true }); // Drops and recreates tables

    // Create sample roles
    const adminRole = await Role.create({ name: 'Admin' });
    const managerRole = await Role.create({ name: 'Manager' });

    console.log('Roles created:', adminRole, managerRole);

    // Create sample users with relations
    const user1 = await User.create({
      username: 'adminUser',
      email: 'admin@example.com',
      roleId: adminRole.id,
    });

    const user2 = await User.create({
      username: 'managerUser',
      email: 'manager@example.com',
      roleId: managerRole.id,
    });

    console.log('Users created:', user1, user2);

  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

// Execute the function
createSampleData();
