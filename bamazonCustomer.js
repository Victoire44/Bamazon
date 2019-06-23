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
        manageProducts();
    });
}
review();

function manageProducts() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What is the ID of the item you would like to purchase?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like?"
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE item_id=?", answer.id, function (err, res) {
            if (err) throw err;
            console.log(res);
            console.log(res.quantity)
            if (answer.quantity < res[0].stock_quantity) {
                console.log("Successfully purchased, you buy" + answer.quantity + res[0].product_name)
            } else {
                console.log("Insufficient quantity!")
            }
        });
    });
};

