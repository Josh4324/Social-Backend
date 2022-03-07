exports.authorization = (...roles) => {
  return (req, res, next) => {
    try {
      const role = req.payload.role;
      if (!roles.includes(role)) {
        return res.status(401).json({
          error: "You do not have access to this route",
          status: "error",
        });
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: "An error occured",
        status: "error",
      });
    }
  };
};
