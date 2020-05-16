//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        deleteBtn: '.item__delete--btn'
    }

    return {
        //Get user input from 'add__container'
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
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

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace placeholder text with actual data
            newHtlm = html.replace('%id%', obj.id);
            newHtlm = newHtlm.replace('%description%', obj.description);
            newHtlm = newHtlm.replace('%value%', obj.value);

            //Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtlm);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        }
    };
})();


//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {

        var DOM = UICtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', function () {
            ctrlAddItem();

        });

        document.addEventListener('keypress', function (event) {
            //Check if Enter key was pressed - Enter keycode: 13 ** event.which - used for older browsers
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function () {
        var input, newItem;

        //1. Get the field input data
        input = UIController.getInput();

        //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add the new item to the UI
        UICtrl.addListItem(newItem, input.type);

        //4Clear the fields on the UI
        UICtrl.clearFields();

        //5. Calculate the budget

        //6. Display the budget on the UI

    };

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(budgetController, UIController);

//Run our program
controller.init();