const Tour = require('./../model/tourModel');

exports.aliasFilter = (req,res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.field = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getTours = async (req,res)=>{
    try {
        const queryObj = {...req.query};
        const excludeQuery = ['page', 'sort', 'limit', 'field'];
        excludeQuery.forEach(el => delete queryObj[el]);

        let QueryStr = JSON.stringify(queryObj);
        QueryStr = QueryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(QueryStr);

        let query = Tour.find(JSON.parse(QueryStr));
        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('name');
        }

        if(req.query.field){
            const fieldSelection = req.query.field.split(',').join(' ');
            query = query.select(fieldSelection);
        }else {
            query = query.select('-__v');
        }

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('This page does not exist');
        }

        const tours = await query;

        res.status(200).json({
            status: 'success',
            length: tours.length,
            data: tours
        })
    }catch (err){
        res.status(404).json({
            status: 'failure',
            message: err
        })
    }
}

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
