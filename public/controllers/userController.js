const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const filterObj = (obj, ...alowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (alowFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      user,
    },
  });
  res.status(500).json({
    status: 'error',
    message: 'not implemented',
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  //2)update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not implemented',
  });
};
