require('dotenv').config();
const { Client } = require('pg');
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    logging: false,
    native: false,
});
const basename = path.basename(__filename);
const modelDefiniers = [];

fs.readdirSync(path.join(__dirname, './models'))
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        modelDefiniers.push(require(path.join(__dirname, '/models', file)));
    });
modelDefiniers.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const {
    Question,
    Category,
    Player,
    Game,
    Stage
} = sequelize.models;

Category.hasMany(Question, { onDelete: "CASCADE" });
Question.belongsTo(Category, { onDelete: "CASCADE" });

Game.belongsToMany(Question, { through: "GameQuestion", onDelete: "CASCADE" });
Question.belongsToMany(Game, { through: "GameQuestion", onDelete: "CASCADE" });

Game.belongsToMany(Player, { through: "GamePlayer", onDelete: "CASCADE" });
Player.belongsToMany(Game, { through: "GamePlayer", onDelete: "CASCADE" });



module.exports = {
    ...sequelize.models,
    conn: sequelize
};