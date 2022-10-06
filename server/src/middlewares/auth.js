import routes from "../routers/routes";

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect(routes.accounts + routes.login);
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect(routes.index);
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect(routes.accounts + routes.login);
  }

  const user = req.user;
  if (user.role !== "admin" && user.role !== "manager") {
    return res.redirect(routes.index);
  }
  next();
};
