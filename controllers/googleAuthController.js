export const getGoogleUser = (req, res) => {
    if (req.user) {
      res.status(200).json({ user: req.user });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };