//BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value) {
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

    var generateUUID = function() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }

    return {
        addItem: function(type, des, val) {
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

        testing: function() {
            console.log(data);
        }
    };

})();


//UI CONTROLLER
var UIController = (function() {
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    //Get user input from 'add__container'
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDomStrings: function() {
            return DOMStrings;
        }
    };
})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {

        var DOM = UICtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', function() {
            ctrlAddItem();
     
         });

        document.addEventListener('keypress', function(event) {
            //Check if Enter key was pressed - Enter keycode: 13 ** event.which - used for older browsers
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function() {
        var input, newItem;

        //1. Get the field input data
        input = UIController.getInput();

        //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add the new item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI

    };

    return {
        init: function() {
            setupEventListeners();
        }
    }

})(budgetController, UIController);

//Run our program
controller.init();

