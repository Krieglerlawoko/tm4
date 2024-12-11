module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Tasks', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Table name that the foreign key references
                key: 'id',      // Column name in the referenced table
            },
            onDelete: 'CASCADE', // Cascade delete tasks when a user is deleted
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Tasks', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: null, // Revert the onDelete constraint
        });
    },
};
