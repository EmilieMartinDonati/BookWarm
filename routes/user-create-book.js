
 /* // POST - create a book


  router.post("/", uploader.single("picture"), async (req, res, next) => {
    const newBook = { ...req.body };
  
    if (!req.file) newBook.picture = undefined;
    else newBook.picture = req.file.path;
    newBook.isBand = req.body.isBand === "on";
  
    try {
      await bookRedModel.create(newBook);
      res.redirect("/index");
    } catch (err) {
      next(err);
    }
  }); */