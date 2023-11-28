const { Review } = require('../models');

exports.createReview = async (req, res, next) => {
    try {
        const newReview = await Review.create({
            userId: req.user.id,
            restaurantId: req.body.restaurantId,
            content: req.body.content,
            rating: req.body.rating,
        });
        res.json(newReview);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findOne({
            where: { id: req.params.reviewId },
        });
        if (!review) {
            return res.status(404).send('Review not found');
        }
        res.json(review);
    } catch (error) {
        console.error(error);
        next(error);
    }
};