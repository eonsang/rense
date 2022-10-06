export const single = (req, res, next) => {
  console.log(req.file);
  return res.json({
    success: true,
    path: `/${req.file.path}`,
  });
};
