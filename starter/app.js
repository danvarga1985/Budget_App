//Budget controller
var budgetController = (function() {
    //code

})();


//UI controller
var UIController = (function() {
    //code
})();


//Global app controller
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem= function() {
         //1. Get the field input data

        //2. Add the item to the budget controller

        //3. Add the new item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI

    };

    document.querySelector('.add__btn').addEventListener('click', function() {
       ctrlAddItem();

    });

    document.addEventListener('keypress', function(event) {
        //Check if Enter key was pressed - Enter keycode: 13 ** event.which - used for older browsers
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);

