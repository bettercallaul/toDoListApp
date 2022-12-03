const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
const date = require(__dirname + '/date.js');
app.listen(1111, () => console.log('connected, port:1111'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/assets'));

mongoose.connect(
  'mongodb://admin-sultan:admin123@ac-k1epehb-shard-00-00.jrhdvqu.mongodb.net:27017,ac-k1epehb-shard-00-01.jrhdvqu.mongodb.net:27017,ac-k1epehb-shard-00-02.jrhdvqu.mongodb.net:27017/?ssl=true&replicaSet=atlas-oay3g7-shard-0&authSource=admin&retryWrites=true&w=majority',
  { useNewUrlParser: true }
);
const itemsSchema = {
  name: String,
};

const Item = mongoose.model('item', itemsSchema);

const item1 = new Item({
  name: 'nyapu-nyapu',
});

const arrayKosong = [item1];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model('List', listSchema);

let today1 = new Date();
const today = today1.toLocaleString('in-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
app.get('/', (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(arrayKosong, (err) => {
        if (err) {
          console.log('failed');
        } else {
          console.log('succeed!');
        }
      });
      res.redirect('/');
    } else {
      res.render('list', { iniHari: today, namaItemBaru: foundItems });
    }
  });
});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === today) {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log('ada yang error');
      } else {
        console.log('berhasil');
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
      if (!err) {
        res.redirect('/' + listName);
      }
    });
  }
});

app.post('/', function (req, res) {
  const itemName = req.body.namaBarang;
  const listName = req.body.tombol;
  const item = new Item({
    name: itemName,
  });

  if (listName === today) {
    item.save();
    res.redirect('/');
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/');
    });
  }
});

app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const daftar = new List({
          name: customListName,
          items: arrayKosong,
        });

        daftar.save();
        res.redirect('/' + customListName);
      } else {
        res.render('list', { iniHari: foundList.name, namaItemBaru: foundList.items });
      }
    }
  });
});

app.get('/about', function (req, res) {
  res.render('about');
});
