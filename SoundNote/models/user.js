var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number, default:0,
    },
	game_1_points: {
		type: Number, default:0,
	},
	game_2_points: {
		type: Number, default:0,
	},
	game_3_points: {
		type: Number, default:0
	}
});

module.exports = mongoose.model('User', userSchema);
