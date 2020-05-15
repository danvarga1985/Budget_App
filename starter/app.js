//BUDGET CONTROLLER
var budgetController = (function() {
    //code

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

    var DOM = UICtrl.getDomStrings();

    var ctrlAddItem= function() {
        //1. Get the field input data
        var input = UIController.getInput();
        console.log(input);

        //2. Add the item to the budget controller

        //3. Add the new item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI

    };

    document.querySelector(DOM.inputBtn).addEventListener('click', function() {
       ctrlAddItem();

    });

    document.addEventListener('keypress', function(event) {
        //Check if Enter key was pressed - Enter keycode: 13 ** event.which - used for older browsers
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);



