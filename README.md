#my-shop

Web application to collect an information about income and get annual income statistics.

##How to use

Run the file (./dist/index.html) in browser Google Chrome.

##Usage

1. In order to add a purchase, you need fill fields (product name, purchase amount, purchase currency, purchase date) and push the button "Purchase".
2. In order to get all list purchased products, you need push the button "All".
3. In order to removes all purchases for specified date, you need choose a date (on the left of the button "Clear") and push the button "Clear".
4. In order to get annual income statistics, you need enter year and chose currency of report (on the left of the button "Report") and push the button "Report".

##Examples

**Input:**

    Enter purchase product name: T-shirt;
    Enter purchase amount: 2;
    Choose purchase currency: USD;
    Choose purchase date: 25-04-2019;
    Click button: "Purchase";

**Output:**

    2019-04-25
    T-shirt 2 USD

**Input:**

    Enter purchase product name: Photo Frame;
    Enter purchase amount: 12;
    Choose purchase currency: EUR;
    Choose purchase date: 25-04-2019;
    Click button: "Purchase";

**Output:**

    2019-04-25
    T-shirt 2 USD
    Photo Frame 12 EUR

**Input:**

    Enter purchase product name: Beer;
    Enter purchase amount: 4.75;
    Choose purchase currency: EUR;
    Choose purchase date: 27-04-2019;
    Click button: "Purchase";

**Output:**

    2019-04-25
    T-shirt 2 USD
    Photo Frame 12 EUR
    2019-04-27
    Beer 4.75 EUR

**Input:**

    Enter purchase product name: Sweets;
    Enter purchase amount: 2.5;
    Choose purchase currency: PLN;
    Choose purchase date: 26-04-2019;
    Click button: "Purchase";

**Output:**

    2019-04-25
    T-shirt 2 USD
    Photo Frame 12 EUR
    2019-04-26
    Sweets 2.5 PLN
    2019-04-27
    Beer 4.75 EUR

**Input:**

    Click button: "All";

**Output:**

    2019-04-25
    T-shirt 2 USD
    Photo Frame 12 EUR
    2019-04-26
    Sweets 2.5 PLN
    2019-04-27
    Beer 4.75 EUR

**Input:**

    Choose clear date: 27-04-2019;
    Click button: "Clear";

**Output:**

    2019-04-25
    T-shirt 2 USD
    Photo Frame 12 EUR
    2019-04-26
    Sweets 2.5 PLN

**Input:**

    Enter year of report: 2019;
    Choose currency of report: UAH;
    Click button: "Report";

**Output:**

    Annual Report 2019
    424.51 UAH

> The total annual income will depend on the exchange rate

##Libraries

[jQuery](https://jquery.com/ "jQuery")
[Typed.js](https://github.com/mattboldt/typed.js/blob/master/README.md "Typed.js")