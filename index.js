const express = require("express");
const uuid = require("uuid").v4
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");
require("dotenv").config();

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./adm/usersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./adm/User");

app.set('view engine', 'ejs');

app.use(session({
    secret: "wordsupersecret", cookie: {maxAge: 6000000}
}));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection
    .authenticate()
    .then(() => {
        console.log("connection to the database made successfully!");
    }).catch((error) => {
        console.log(error);
    })

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });    
    });
});

app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(articles => {
        if (articles != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {articles: articles, categories: categories});
            });  
        } else {
            res.redirect("/");
        }
    }).catch( error => {
        res.redirect("/");
    })
});

app.get("/category/:slug", (req,res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles, categories: categories});
        });
        } else {
            res.redirect("/");
        }
    }).catch( error => {
        res.redirect("/");
    });
});

app.listen(process.env.serverPort, () => {
    console.log("Online server!");
});





