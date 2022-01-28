const express = require("express"),
  bodyParser = require("body-parser"),
  ejs = require("ejs");
const mongoos = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoos.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});

const articalSchema = new mongoos.Schema({
  //validateing
  title: String,
  content: String,
});

const ArticalSchema = mongoos.model("Artical", articalSchema);

app
  .route("/articles")
  .get(function (req, res) {
    ArticalSchema.find(function (err, foundArtical) {
      res.send(foundArtical);
    });
  })
  .post(function (req, res) {
    const artical = new ArticalSchema({
      title: req.body.title,
      content: req.body.content,
    });

    artical.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("saved");
      }
    });
  })
  .delete(function (req, res) {
    ArticalSchema.deleteMany(function (err) {
      if (!err) {
        res.send("deleted");
      } else {
        res.send(err);
      }
    });
  });

//   =============================== specific data ========================================
app.route("/articles/:articalTitle")
.get(function(req, res){
    ArticalSchema.findOne({title: req.params.articalTitle}, function(err, artical){
        if(artical){
            res.send(artical);
        }else{
            res.send("notound")
        }
    })
}).delete(function(req,res){
    ArticalSchema.findOneAndDelete(
        {title : req.params.articalTitle},
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send("Deleted");
            }
        }
    )
})
.patch(function(req, res){
    ArticalSchema.findOneAndUpdate(
        {title : req.params.articalTitle},
        {$set: {content : req.body.content}},
        function(err){
            if(!err){
                res.send("updated patch");
            }else{
                res.send(err)
            }
        }
    )
})
.put(function(req, res){
    ArticalSchema.findOneAndUpdate(
        {title: req.params.articalTitle},
        {title : req.body.title, content : req.body.content},
        {overwrite: true},
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send("Updated")
            }
        }
    )
});

// app.get("/articles", function (req, res) {
//   ArticalSchema.find(function (err, foundArtical) {
//     res.send(foundArtical);
//   });
// });

// app.post("/articles", function (req, res) {
//   const artical = new ArticalSchema({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   artical.save(function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("saved");
//     }
//   });
// });

app.delete("/articles", function (req, res) {
  ArticalSchema.deleteMany(function (err) {
    if (!err) {
      res.send("deleted");
    } else {
      res.send(err);
    }
  });
});

//host server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
