const ListModel = require("../Model/gameListModel");
const { uploadFile } = require("../aws/uploadfile");

const createGames = async function (req, res) {
    try {
        let data = req.body;

        let { gameId, gameName, gameImage, gameLink, gameDescription, Coins } =
            data;

        // let files = req.files;

        // if (files && files.length > 0) {
        //   profileImage = await uploadFile(files[0]); //select first image
        // }
        // data.profileImage = profileImage;
        let game = await ListModel.create(data);
        res
            .status(201)
            .send({ status: true, data: game, msg: "Game Successfully Created" });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err });
    }
};

module.exports.createGames = createGames;
