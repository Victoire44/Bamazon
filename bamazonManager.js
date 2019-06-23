var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
})

function review() {
    connection.query("SELECT * FROM products", function (err, res) {
        var table = new Table({
            head: ["ID", "Product", "Department", "Price", "Quantity"],
            colWidths: [10, 20, 15, 10, 10]
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        option();
    });
}
review();

function option() {
    inquirer.prompt([
        {
            type: "list",
            name: "userOption",
            message: "What would you like to do?",
            choices: ["View Products for sale", "View Low Inventory", "Add to Inventory", "Add New product", "Quit"]
        },

    ]).then(function (answer) {
        switch (answer.userOption) {
            case "View Products for Sale":
                inventory();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New product":
                addProduct();
                break;
            default:
                "unknown command" + answer.userOption;
                break;
        }
    });
};

var inventory = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity)
        };
        option()
    });
};

var lowInventory = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                console.log(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity)
            };
        };
        option()
    });
};

var addInventory = function(){
 
};

var addProduct = function(){
    inquirer.prompt([
        {
            type: "input",
            name: "addProduct",
            message: "What is the name of the product you would like to add?",
        },
        {
            type: "list",
            name: "department",
            message: "Which department does this product fall into?",
            choices: ["Video Games", "Apparel", "Necessities", "Film", "Board Games"]
        },
        {
            type: "input",
            name: "cost",
            message: "how much does it cost?",
            filter: Number
        },
        {
            type: "input",
            name: "number",
            message: "how many do we have?",
            filter: Number
        },
    ]).then(function(answer){
        console.log(answer.addProduct + " added to Bamazon !" )
    })

}