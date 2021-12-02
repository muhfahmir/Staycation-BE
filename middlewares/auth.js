const isLogin = (req, res, next) => {
  if (req.session.user == null || req.session.user == undefined) {
    req.flash(
      "alertMessage",
      "Sesssion telah habis silahkan signin kembali!!!"
    );
    req.flash("alertStatus", "danger");
    res.redirect("/admin/signin");
  }
  next();
};

module.exports = isLogin;
