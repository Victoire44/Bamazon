var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");


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
        console.log("\n==================================================\n")
        manageProducts();
    });
}
review();

function manageProducts() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What is the ID of the item you would like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        connection.query("SELECT stock_quantity, product_name FROM products WHERE ?", [{
            item_id: answer.id
        }], function (err, res) {
            if (err) throw err
            if (res.length === 0) {
                console.log("\n===================================================\n")
                console.log(("Sorry, this ID doesn't exist.").yellow)
                console.log("\n===================================================\n")
                manageProducts()
            } else if (res[0].stock_quantity > answer.quantity) {
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: parseInt(res[0].stock_quantity) - parseInt(answer.quantity)
                        },
                        {
                            item_id: answer.id
                        }
                    ])
                console.log("\n==================================================\n")
                console.log(("Successfully purchased " + answer.quantity + " " + res[0].product_name + "'s").yellow)
                console.log("\n==================================================\n")
                review()
            } else {
                console.log("\n===================================================\n")
                console.log("Insufficient quantity!".yellow)
                console.log("\n===================================================\n")
                review()
            }
        });
    });
};