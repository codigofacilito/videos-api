'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.user = this.belongsTo(models.User);
      
      
    }
  };
  Video.init({
    title: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    remoteVideoId: DataTypes.STRING,
    remoteMp4: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Video',
  });
7
  Video.paginate = async (pageParam,userId) => {
    console.log(pageParam);
    const escapedUserId = sequelize.escape(`${userId}`);
    const limit = 4;
    const page = (parseInt(pageParam) - 1) || 0;
    let response = await Video.findAndCountAll({
      limit: limit,
      offset: page * limit,
      order: [['id', 'DESC']],
      attributes: {
        include: [
          [
            // Note the wrapping parentheses in the call below!
            sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Likes as likes
                    WHERE
                        likes.videoId = Video.id
                        AND likes.userId = ${escapedUserId}
                )`),
            'isLikedByCurrentUser'
          ]
        ]
      }
    });
    return {
      videos: response.rows,
      currentPage: page,
      nextPage: response.count > ((page * limit) + limit) ? parseInt(pageParam) + 1 : null,
      prevPage: page == 0 ? null : page - 1,
      total: response.count
    }
  }


  return Video;

  
};