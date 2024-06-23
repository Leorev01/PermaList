import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"MynameisLeo123!",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
let chosenDate = '';

async function getItems(){
  items = [];
  let result = await db.query("SELECT * FROM items ORDER BY id ASC");
  console.log(result.rows);
  result.rows.forEach((item) => items.push(item));
}

async function addPost(input){
  await db.query("INSERT INTO items(title, date) VALUES ($1, $2)", [input, chosenDate]);
}

async function editPost(edited, id){
  await db.query("UPDATE items SET title = $1 WHERE id = $2", 
    [edited, id]);
}

async function deletePost(id){
  await db.query("DELETE FROM items WHERE id = $1",[id])
}

async function setDate(date){
  try{
    items = [];
    chosenDate = date;
    let result = await db.query("SELECT * FROM items WHERE date = $1", [date]);
    result.rows.forEach((item) => items.push(item));
  }
  catch(err){
    console.log(err);
  }
}

app.get("/", async (req, res) => {
  try{
    if(chosenDate!= ''){
      await setDate(new Date(chosenDate));
      res.render("index.ejs", {
        listTitle: chosenDate.toISOString().split('T')[0],
        listItems: items,
      });
    }
    else{
      console.log(new Date(Date.now()));
      await setDate(new Date(Date.now()));
      res.render("index.ejs", {
        listTitle: "Today",
        listItems: items,
      });
    }
    
  }
  catch(err){
    console.log(err);
  }

});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await addPost(item);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  let updatedTitle = req.body.updatedItemTitle;
  let updatedItemId = req.body.updatedItemId;
  try{
    await editPost(updatedTitle,updatedItemId);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  try{
    await deletePost(req.body.deleteItemId);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/setdate", async (req,res) => {
  try{
    chosenDate = req.body.date;
    await setDate(chosenDate);
    res.redirect("/")
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
