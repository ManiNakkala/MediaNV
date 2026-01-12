const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

const checkCandidate = (req, res, next) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Access denied. Candidates only.' });
  }
  next();
};

module.exports = { checkAdmin, checkCandidate };
