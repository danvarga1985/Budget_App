//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current) {
            sum += current.value;
        })

        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    var generateUUID = function () {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //Create a unique ID
            ID = generateUUID();

            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }

            //Push it into data structure
            data.allItems[type].push(newItem);

            //Return the new element
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;

            //Create a new array with the map function, containing the ids.
            ids = data.allItems[type].map(function (current) {
                return current.id;
            })

            //Determine the index of the wanted element
            index = ids.indexOf(id);

            //Determine if the wanted element exists
            if (index != -1) {
                //Delete 1 element at the specified index
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {
            
            //Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the percentage of income that we spent
            data.percentage = data.totals.inc > 0 ? Math.round((data.totals.exp / data.totals.inc) * 100) : -1;
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            })
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            })
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log(data);
        }
    };

})();


//UI CONTROLLER
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        itemDescription: '.item__description',
        itemValue: '.item__value',
        deleteBtn: '.item__delete--btn',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        incomeList: '.income__list',
        expensesPercLabel: '.item__percentage'
    }

    var formatNumber = function (num, type) {
        var numSplit, numInt, numDec, type;

        //Override the num argument
        num = Math.abs(num);

        //Set the decimal values to 2
        num = num.toFixed(2);

        numSplit = num.split('.');
        numInt = numSplit[0];
        numDec = numSplit[1];
        
        if (numInt.length > 3) {
            numInt = numInt.substr(0, numInt.length - 3) + ',' + numInt.substr(numInt.length - 3, 3);
        }

        return (type === 'exp' ? '-' : '+') + numInt + '.' + numDec;
    }

    return {
        //Get user input from 'add__container'
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        //Get html elements as variables
        getDomStrings: function () {
            return DOMStrings;
        },

        //Updade the User Interface with changes in the data structure
        addListItem: function (obj, type) {
            var html, newHtlm;

            //Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace placeholder text with actual data
            newHtlm = html.replace('%id%', obj.id);
            newHtlm = newHtlm.replace('%description%', obj.description);
            newHtlm = newHtlm.replace('%value%', formatNumber(obj.value, type));

            //Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtlm);
        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        //Clear the 'Description' and 'Value' input fields
        clearFields: function() {
            var fields, fieldsArr;

            //Select the required input fields -> return them as a static Nodelist object
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            //Turn the Nodelist into an array, by calling (function-borrow) the Array object's slice function on the nodelist.
            fieldsArr = Array.prototype.slice.call(fields);

            //Iterate through the array, set value to "".
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            //Keep the cursor in the first element of the list (Description input field)
            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpenses, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {
            //Select the percentage label of every expense element, and save them as a NodeList object
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            //Iterate through a list and call a function on each element
            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback (list[i], i);
                }
            }

            //Call above function with the fields and anonymous function as parameters
            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            })
        }
    };
})();


//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            //Check if Enter key was pressed - Enter keycode: 13 ** event.which - used for older browsers
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }

    var ctrlAddItem = function () {
        var input, newItem;

        //1. Get the field input data
        input = UIController.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields on the UI
            UICtrl.clearFields();

            //5- Calculate and update budget
            updateBudget();

            //6. Calculate and update the percentages
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //example id: inc-508ca39b-07ce-407e-8908-0bb1c4513b13
            //split only after the first '-'
            splitID = itemID.split(/-(.+)/);
            type = splitID[0];
            ID = splitID[1];

            //1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //3. Update and show the new budget
            updateBudget();

            //4. Calculate and update the percentages
            updatePercentages();
        }
    }

    var updateBudget = function () {

        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budget = budgetCtrl.getBudget();

        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function () {
        
        //1. Calculate the percentages
        budgetCtrl.calculatePercentages();

        //2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        //3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    }

    return {
        init: function () {
            //Set the UI values to 0
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    }

})(budgetController, UIController);

//Run our program
controller.init();