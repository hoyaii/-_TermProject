const { User, Order } = require('../models');

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.userId },
        });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.update({
            email: req.body.email,
            name: req.body.name,
        }, {
            where: { id: req.params.userId },
        });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { id: req.params.userId },
        });
        if (!result) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        next(error);
    }
};
