export function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    return res.redirect("/login");
  }

  req.user = req.session.user;
  next();
}
