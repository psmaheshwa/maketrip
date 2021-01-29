const Tour = require('./../model/tourModel');
const ApiFeatures = require('./../utils/apiFeatures')

exports.aliasFilter = (req,res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.field = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getTours = async (req, res) => {
    try {
        const features = new ApiFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req,res)=>{
    try{
        console.log(req.params.id);
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: tour
        })
    }catch (err){
        res.status(404).json({
            status:'Failure',
            data:err
        })
    }
}

exports.deleteTour = async (req,res)=>{
    try{
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null
        })
    }catch (err){
        res.status(404).json({
            status:'Failure',
            data:err
        })
    }
}

exports.addTour = async (req,res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'Success',
            data: newTour
        })
    }catch (err){
        console.log(err)
        res.status(400).json({
            status: 'Failure',
            data: err
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        console.log(req.body, req.params.id)
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getStats = async (req, res) => {
    try{
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5 }}
            },
            {
                $group: {
                    _id: {$toUpper: '$difficulty'},
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRatings: {$avg : '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                }
            },
            {
                $sort:{avgPrice: 1}
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: stats
        });
    }catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
