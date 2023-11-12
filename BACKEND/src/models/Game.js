const {DataTypes,UUIDV4, Sequelize}=require('sequelize');

module.exports=(sequelize)=>{
    sequelize.define('Game',{
        id_game:{
            type:DataTypes.UUID,
            primaryKey:true,
            allowNull:false,
            defaultValue:UUIDV4
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        date:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:Sequelize.NOW

        }
    });
}