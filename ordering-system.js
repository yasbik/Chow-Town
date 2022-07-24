'use strict';

const e = React.createElement;

class OrderingSystem extends React.Component {
    constructor(props){
        super(props);
        const searchParams = new URLSearchParams(window.location.search);
        var i = 0;
        var newOrders = [];
        var newImages =[];
        var maxOrderItemID = 0;
        while (decodeURIComponent(searchParams.get(i)) !="null") 
        {
            var name = decodeURIComponent(searchParams.get(i))
            var obj = JSON.parse(name);
            var orderobj = obj.props;
            newOrders = newOrders.concat(<OrderItem orderRestaurantName = {orderobj.orderRestaurantName} orderItemName = {orderobj.orderItemName} orderItemCost = {orderobj.orderItemCost} orderItemNotes={orderobj.orderItemNotes} orderItemID={orderobj.orderItemID}/>);
            if (orderobj.orderRestaurantName == "Pizza Time"){
                newImages = newImages.concat(<ImageItem imageLink="src/pizza-2.png"  orderItemID={orderobj.orderItemID}/>)
            }
            else if (orderobj.orderRestaurantName =="Burger Queen"){
                newImages = newImages.concat(<ImageItem imageLink="src/burger-transparent-bg-2.png"  orderItemID={orderobj.orderItemID}/>)
            }
            if(orderobj.orderItemID > maxOrderItemID){
                maxOrderItemID = orderobj.orderItemID;
            }
            console.log(JSON.stringify(newImages, null, 4));
            i= i +1;
        }
        this.state = {
            selectedRestaurant: -1,
            orders: newOrders,
            currentOrderItemID: maxOrderItemID+1,
            orderImages: newImages
        };
        this.handleRestaurantSelect = this.handleRestaurantSelect.bind(this);
        this.handleMenuItemSubmit = this.handleMenuItemSubmit.bind(this);
        this.handleEditOrder = this.handleEditOrder.bind(this);
        this.removeOrderItem = this.removeOrderItem.bind(this);
    }

    removeOrderItem(itemID){
        const newOrderArray = this.state.orders.slice();
        const newOrderImageArray = this.state.orderImages.slice();
        for(let i = 0; i < newOrderArray.length; i++){
            if(newOrderArray[i].props.orderItemID === itemID){
                newOrderArray.splice(i, 1);
            }
        }
        console.log(JSON.stringify(newOrderArray, null, 4));
        for(let i = 0; i < newOrderImageArray.length; i++){
            if(newOrderImageArray[i].props.orderItemID === itemID){
                newOrderImageArray.splice(i,1);
            }
        }
        this.setState({orders: newOrderArray, orderImages: newOrderImageArray});
    }

    handleEditOrder(){
        $('#edit-order-modal').modal('show');
    }

    handleRestaurantSelect(newSelected){
        this.setState({selectedRestaurant:newSelected});
    }

    getOrderNotes(formState, menuItemID){
        const firstTopping = formState.firstTopping;
        const secondTopping = formState.secondTopping;
        const thirdTopping = formState.thirdTopping;
        const fourthTopping = formState.fourthTopping;
        const Lettuce = formState.Lettuce;
        const Tomato = formState.Tomato;
        const Onion = formState.Onion;
        const Mushroom = formState.Mushroom;
        const Hot_Sauce = formState.Hot_Sauce;
        const Barbeque_Sauce = formState.Barbeque_Sauce;
        const Mustard = formState.Mustard;
        const Ketchup = formState.Ketchup;
        const Pickles = formState.Pickles;
        const Jalapeno_Peppers = formState.Jalapeno_Peppers;
        
        let result = [];

        if(menuItemID == 0 || menuItemID == 1 || menuItemID == 2 || menuItemID == 3){
            if(firstTopping){
                result.push(firstTopping);
            }
            if(secondTopping){
                result.push(secondTopping);
            }
            if(menuItemID == 1 || menuItemID == 2 || menuItemID == 3){
                if(thirdTopping){
                    result.push(thirdTopping);
                }
                if(menuItemID == 3){
                    if(fourthTopping){
                        result.push(fourthTopping);
                    }
                }
            }
        }else if(menuItemID == 4 || menuItemID == 5 || menuItemID == 6 || menuItemID == 7){
            if(Lettuce){
                result.push("Lettuce")
            }
            if(Tomato){
                result.push("Tomato")
            }
            if(Onion){
                result.push("Onion")
            }
            if(Mushroom){
                result.push("Mushroom")
            }
            if(Hot_Sauce){
                result.push("Hot Sauce")
            }
            if(Barbeque_Sauce){
                result.push("Barbeque Sauce")
            }
            if(Mustard){
                result.push("Mustard")
            }
            if(Ketchup){
                result.push("Ketchup")
            }
            if(Pickles){
                result.push("Pickles")
            }
            if(Jalapeno_Peppers){
                result.push("Jalapeno Peppers")
            }
        }

        if(formState.additionalInfo){
            result.push(formState.additionalInfo);
        }
        return result;
    }

    handleMenuItemSubmit(event, restaurantName, orderItemName, orderItemCost, formState, menuModalID, menuItemID, imageLink, clearStateFunct){
        const orderNotes = this.getOrderNotes(formState, menuItemID);
        const orderItemID = this.state.currentOrderItemID;
        const newOrders = this.state.orders.concat(<OrderItem orderRestaurantName = {restaurantName} orderItemName = {orderItemName} orderItemCost = {orderItemCost} orderItemNotes={orderNotes} orderItemID={orderItemID}/>);
        const newOrderImages = this.state.orderImages.concat(<ImageItem imageLink={imageLink} orderItemID={orderItemID} />);
        this.setState({orders: newOrders, currentOrderItemID: this.state.currentOrderItemID+1, orderImages: newOrderImages});
        clearStateFunct();
        $("#"+menuModalID).modal('hide');
        event.preventDefault();''
    }

    //code from https://gist.github.com/tjmehta/9204891
     objectToQuerystring (obj) {
        return Object.keys(obj).filter((key) => obj[key] != undefined && obj[key] != '').reduce((str, key, i) => {
          var delimiter: string, val;
          delimiter = (i === 0) ? '?' : '&';
          if(Array.isArray(obj[key])) {
            key = encodeURIComponent(key);
            var arrayVar = obj[key].reduce((str, item) => {
              val = encodeURIComponent(JSON.stringify(item));
              return [str, key, '=', val, '&'].join(''); 
            }, '');
            return [str, delimiter, arrayVar.trimRightString('&')].join('');
          } else {
            key = encodeURIComponent(key);
            val = encodeURIComponent(JSON.stringify(obj[key]));
            return [str, delimiter, key, '=', val].join('');      
          }
        }, '');
    }

    toCheckOut(){
        var query= this.objectToQuerystring(this.state.orders);
        window.location.href = "checkout.html" + query;
    }

    render(){
        let orderTotal = 0.0;

        for(let i = 0; i < this.state.orders.length; i++){
            orderTotal += parseFloat(this.state.orders[i].props.orderItemCost);
        }

        return (
        <div class="container">
            <div class="row">
                <div class="col-lg">
                    <ImageTray orderImages={this.state.orderImages} />
                </div>
            </div>
            <div class="row">
                <div class="col-sm">
                    <RestaurantColumn
                        handleClick={this.handleRestaurantSelect}
                        selectedRestaurant={this.state.selectedRestaurant}
                    />
                </div>
                <div class="col-sm">
                    <MenuColumn 
                        selectedRestaurant={this.state.selectedRestaurant}
                        handleSubmit={this.handleMenuItemSubmit}
                    />
                </div>
                <div class="col-sm">
                    <OrderColumn orders={this.state.orders} handleEditOrder={this.handleEditOrder}/>
                    <div class="col-sm column-footer">
                        <table>
                            <tr>
                                <td class="order-item-name">Total:</td>
                                <td> <h2> &nbsp;${Number((orderTotal).toFixed('2'))}</h2>
                                
                                </td>
                            </tr>
                        </table>  
                        <table>
                            <tr>
                                <td class="order-item-name"> <button onClick={()=>alert("This order has been saved! (Or at least it would be if this were a functioning application!)")} class="btn btn-secondary text-left">Save Order</button>
                                </td>
                                <td><button onClick={() => this.toCheckOut()} class="btn btn-primary text-right">Checkout</button></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="edit-order-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Edit Order</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <table class="edit-order-item-table">
                                {
                                this.state.orders.map((orderItem) => <tr><td class="remove-order-item-cell"><button class="btn btn-danger" onClick={()=>this.removeOrderItem(orderItem.props.orderItemID)}>Remove Item</button></td><td class="order-item-in-table">{orderItem}</td></tr>)
                                }
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" data-dismiss="modal">Back to order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

class ImageItem extends React.Component {
    render(){
        return (
            <img src={this.props.imageLink} class="tray-image"></img>
        );
    }
}

class ImageTray extends React.Component {
    render(){
        return (
        <div class="row">
            <div id="image-tray" class="col-lg">
                {this.props.orderImages}
            </div>
        </div>
        );
    }
}

class RestaurantItem extends React.Component {
    render(){
        // this is the state of the restaurant pre-click. We can have different rendering based on if they have clicked or not.
        const restaurantID = this.props.restaurantID;
        const restaurantName = this.props.restaurantName;
        const restaurantType = this.props.restaurantType;
        const restaurantRating = this.props.restaurantRating;
        const restaurantPicture = this.props.restaurantPicture;
        const selected = this.props.selected;
        const restaurantBlurb = this.props.blurb;

        if(selected){
            return (
                <div class="row restaurant-item-active" onClick={() => this.props.handleClick(restaurantID)}>
                    <div class="col-sm restaurant-image"><img class="restaurant-image" src={restaurantPicture}></img></div>
                    <div class="col-md">
                        <div class="row"><strong>{restaurantName}</strong></div>
                        <div class="row">{restaurantType}</div>
                        <div class="row"><button class="btn btn-success btn-sm" disabled>More info</button></div>
                    </div>
                    <div class="col-sm restaurant-rating"><img class="rating-image" src={restaurantRating}></img></div>
                </div>
            );
        }else{
            return (
                <div class="row restaurant-item" onClick={() => this.props.handleClick(restaurantID)}>
                    <div class="col-sm restaurant-image"><img class="restaurant-image" src={restaurantPicture}></img></div>
                    <div class="col-md">
                        <div class="row"><strong>{restaurantName}</strong></div>
                        <div class="row">{restaurantType}</div>
                    </div>
                    <div class="col-sm restaurant-rating"><img class="rating-image" src={restaurantRating}></img></div>
                </div>
            );
        }
    }
}

class RestaurantColumn extends React.Component {
    render(){
        const pizzaTimeBlurb = <p>Pizza Time is a casual place to grab a great slice of pizza!</p>
        const burgerQueenBlurb = <p>Burger Queen prides itself on a fantastic, custom-made-by-you burger!</p>
        let selectedPizzaTime = false;
        let selectedBurgerQueen = false;
        if(this.props.selectedRestaurant == 0){
            selectedPizzaTime = true;
        }else if(this.props.selectedRestaurant == 1){
            selectedBurgerQueen = true;
        }else{
            selectedPizzaTime = false;
            selectedBurgerQueen = false;
        }
        return (
        <div>
            <div class="col-sm column-header">
                <h2>Restaurants</h2>
                <div class="row">
                    <div class="col"><input type="text" class="form-control column-search-bar" placeholder="Search restaurants"></input></div>
                    <div class="col-sm-auto"><button class="btn btn-success" disabled>Search</button></div>
                </div>
            </div>
            <div class="col-sm restaurant-ordering-column">
                <RestaurantItem restaurantID = "0" restaurantName = "Pizza Time" restaurantType = "Casual" restaurantRating = "src/fourStars.png" restaurantPicture="src/pizza_time.jpeg" handleClick={this.props.handleClick} selected={selectedPizzaTime} blurb={pizzaTimeBlurb}/>
                <br/>
                <RestaurantItem restaurantID = "1" restaurantName = "Burger Queen" restaurantType = "Casual" restaurantRating = "src/threePointFiveStars.png" restaurantPicture="src/burger_queen.jpeg" handleClick={this.props.handleClick} selected={selectedBurgerQueen} blurb={burgerQueenBlurb}/>
            </div>
        </div>
        );
    }
}

class MenuItem extends React.Component {
    // We need to store the form in this component I think?
    // Does it need to be passed as props? When the MenuItem component is clicked, we must spawn a pop-up component (the form).
    // I think the form can be a component?
    cancelItem(menuItemID){
        document.getElementById('menu-form'+menuItemID).reset();
    }

    render(){
        const menuItemID = this.props.menuItemID;
        const menuItemPicture = this.props.menuItemPicture;
        const menuItemName = this.props.menuItemName;
        const menuItemPrice = this.props.menuItemPrice;

        const menuModalID = "menuModal-"+menuItemID;
        const menuModalIDSelector = "#"+menuModalID;

        const formData = <MenuForm handleSubmit={this.props.handleSubmit} restaurantName= {this.props.restaurantName} menuItemID={menuItemID} menuItemName = {menuItemName} menuItemPrice={menuItemPrice} menuModalID={menuModalID} cancelItem = {this.cancelItem} menuImageLink={menuItemPicture}/>;


        return (
        <div>
            <div class="row restaurant-item" data-toggle="modal" data-target={menuModalIDSelector}>
                <div class="col-sm restaurant-image"><img class="restaurant-image" src={menuItemPicture}/></div>
                <div class="col-md">
                    <div class="row">{menuItemName}</div>
                </div>
                <div class="col-sm">${menuItemPrice}</div>
            </div>
            <div class="modal fade" id={menuModalID} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">

                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{menuItemName}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        {formData}
                    </div>
                </div>
            </div>
            <br></br>
        </div>
        );
    }
}

class MenuColumn extends React.Component {
    pizzaTimeItems = [
        <MenuItem menuItemID = "0" restaurantName="Pizza Time" menuItemName = "Large 2-Topping Pizza" menuItemPrice = "16.99" menuItemPicture="src/pizza-2.png" handleSubmit={this.props.handleSubmit}/>,
        <MenuItem menuItemID = "1" restaurantName="Pizza Time" menuItemName = "Medium 3-Topping Pizza" menuItemPrice = "15.99" menuItemPicture="src/pizza-2.png" handleSubmit={this.props.handleSubmit}/>,
        <MenuItem menuItemID = "2" restaurantName="Pizza Time" menuItemName = "Large 3-Topping Pizza" menuItemPrice = "18.99" menuItemPicture="src/pizza-2.png" handleSubmit={this.props.handleSubmit}/>,
        <MenuItem menuItemID = "3" restaurantName="Pizza Time" menuItemName = "The Great Big Pizza" menuItemPrice = "30.99" menuItemPicture="src/pizza-2.png" handleSubmit={this.props.handleSubmit}/>
    ];
    burgerQueenItems = [
        <MenuItem menuItemID = "4" restaurantName="Burger Queen" menuItemName = "Big Burg" menuItemPrice = "20.99" menuItemPicture="src/burger-transparent-bg-2.png" handleSubmit={this.props.handleSubmit}/>,
        <MenuItem menuItemID = "5" restaurantName="Burger Queen" menuItemName = "Baby Burg" menuItemPrice = "5.99" menuItemPicture="src/burger-transparent-bg-2.png" handleSubmit={this.props.handleSubmit}/>,
        <MenuItem menuItemID = "6" restaurantName="Burger Queen" menuItemName = "Filling Burg" menuItemPrice = "13.99" menuItemPicture="src/burger-transparent-bg-2.png" handleSubmit={this.props.handleSubmit}/>,
        <MenuItem menuItemID = "7" restaurantName="Burger Queen" menuItemName = "Average Joe" menuItemPrice = "13.66" menuItemPicture="src/burger-transparent-bg-2.png" handleSubmit={this.props.handleSubmit}/>
    ];

    render(){
        let activeMenu = [];

        if(this.props.selectedRestaurant == 0){
            activeMenu = this.pizzaTimeItems;
        }else if(this.props.selectedRestaurant == 1){
            activeMenu = this.burgerQueenItems;
        }else if(this.props.selectedRestaurant == -1){
            activeMenu = "Select a restaurant to begin!";
        }

        return (
        <div>
            <div class="col-sm column-header">
                <h2>Menu</h2>
                <div class="row">
                    <div class="col"><input type="text" class="form-control column-search-bar" placeholder="Search menu items"></input></div>
                    <div class="col-sm-auto"><button class="btn btn-success" disabled>Search</button></div>
                </div>
            </div>
            <div class="col-sm ordering-column">
                {activeMenu}
            </div>
        </div>
        );
    }
}

class OrderItem extends React.Component {
    render(){
        const orderRestaurantName = this.props.orderRestaurantName;
        const orderItemName = this.props.orderItemName;
        const orderItemCost = this.props.orderItemCost;
        const orderItemNotes = this.props.orderItemNotes;
        return (
        <div class="row">
            <table>
                <tr>
                    <th><strong>{orderRestaurantName}</strong></th>
                </tr>
                <tr>
                    <td class="order-item-name">{orderItemName}</td>
                    <td>{orderItemCost}</td>
                </tr>
                <tr>
                    <ul>
                        {
                        orderItemNotes.map((orderNote) => <li>{orderNote}</li>)
                        }
                    </ul>
                </tr>
            </table>
        </div>
        );
    }
}

class OrderColumn extends React.Component {
    render(){
        return (
            <div>
                <div class="col-sm column-header">
                    <table>
                        <tr>
                            <td class="header-title-table"><h2>Order</h2></td>
                            <td><button class="btn btn-danger btn-sm" onClick={this.props.handleEditOrder}>Edit order</button></td>
                        </tr>
                    </table>
                </div>
                <div class="col-sm ordering-column">
                    {this.props.orders}
                </div>
            </div>
        );
    }
}

const initialState = {
    firstTopping: "",
    secondTopping: "",
    thirdTopping: "",
    fourthTopping: "",
    Lettuce: false,
    Tomato: false,
    Onion: false,
    Mushroom: false,
    Hot_Sauce: false,
    Barbeque_Sauce: false,
    Mustard: false,
    Ketchup: false,
    Pickles: false,
    Jalapeno_Peppers: false,
    additionalInfo: ""
};

class MenuForm extends React.Component {
    constructor(props){
        super(props);
        this.state = initialState;

        this.handleChange = this.handleChange.bind(this);
        this.clearState = this.clearState.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    handleCheckboxChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]:value
        });
    }

    clearState(){
        this.setState(initialState);
    }

    handleCancel(menuItemID){
        this.props.cancelItem(menuItemID);
        this.clearState();
    }
// Forms:
    // Short blurb about the item, what it includes, etc.
    // Pizza Time:
        // Dropdowns for the number of toppings
        // Section for user to enter extra instructions
    // Burger Queen:
        // Assemble extra toppings (each burger has patties, cheese, bacon, etc)
        // Section for the user to enter extra instructions.

    render(){
        let formContent = null;
        if(this.props.menuItemID == 0){
            // large 2-topping pizza
            formContent=(
                <div>
                    <p>The large 2-topping pizza is served on a 16" golden crust, topped with mozzarella and our in-house red sauce. The other toppings? Well, that's your job!</p>
                    <label htmlFor="firstTopping">Select your first topping:</label>
                    <select name="firstTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="secondTopping">Select your second topping:</label>
                    <select name="secondTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <input name="additionalInfo" class="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
                </div>
            );
        }else if(this.props.menuItemID == 1){
            // medium 3-topping pizza
            formContent=(
                <div>
                    <p>The medium 3-topping pizza is served on a 12" golden crust, topped with mozzarella and our in-house red sauce. The other toppings? Well, that's your job!</p>
                    <label htmlFor="firstTopping">Select your first topping:</label>
                    <select name="firstTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="secondTopping">Select your second topping:</label>
                    <select name="secondTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="thirdTopping">Select your third topping:</label>
                    <select name="thirdTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <input name="additionalInfo" class="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
                </div>
            );
        }else if(this.props.menuItemID == 2){
            // large 3-topping pizza
            formContent=(
                <div>
                    <p>The large 3-topping pizza is served on a 16" golden crust, topped with mozzarella and our in-house red sauce. The other toppings? Well, that's your job!</p>
                    <label htmlFor="firstTopping">Select your first topping:</label>
                    <select name="firstTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="secondTopping">Select your second topping:</label>
                    <select name="secondTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="thirdTopping">Select your third topping:</label>
                    <select name="thirdTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <input name="additionalInfo" class="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
                </div>
            );
        }else if(this.props.menuItemID == 3){
            // the great big pizza -> extra large deep dish 4 topping pizza
            formContent=(
                <div>
                    <p>The Great Big Pizza is a whopping 20" deep-dish crust, topped with mozzarella and our in-house red sauce. Plus, you get 4 toppings to add. Can you handle that?</p>
                    <label htmlFor="firstTopping">Select your first topping:</label>
                    <select name="firstTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola Cheese</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="secondTopping">Select your second topping:</label>
                    <select name="secondTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola Cheese</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="thirdTopping">Select your third topping:</label>
                    <select name="thirdTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola Cheese</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="fourthTopping">Select your fourth topping:</label>
                    <select name="fourthTopping" class="form-control" onChange={this.handleChange}>
                        <option value="None">None</option>
                        <optgroup label="Meat">
                            <option value="Pepperoni">Pepperoni</option>
                            <option value="Bacon">Bacon</option>
                            <option value="Sausage">Sausage</option>
                            <option value="Buffalo Chicken">Buffalo Chicken</option>
                        </optgroup>
                        <optgroup label="Cheese">
                            <option value="Swiss">Swiss Cheese</option>
                            <option value="Gorgonzola">Gorgonzola Cheese</option>
                            <option value="Goat Cheese">Goat Cheese</option>
                        </optgroup>
                        <optgroup label="Vegetables">
                            <option value="Green Peppers">Green Peppers</option>
                            <option value="Onions">Onions</option>
                            <option value="Pineapple">Pineapple</option>
                            <option value="Tomatoes">Tomatoes</option>
                            <option value="Olives">Olives</option>
                        </optgroup>
                    </select>
                    <br></br>
                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <input name="additionalInfo" class="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
                </div>
            );
        }else if(this.props.menuItemID == 4){
            // big burg -> 3 patties, cheese, bacon
            formContent=(
                <div>
                    <p>The Big Burg is for big bellies. Say hello to 3 1/4-pound patties glued together with cheese and topped with bacon -- plus whatever toppings you can stomach! Served with home-cut fries!</p>
                    <input name="Lettuce" type="checkbox" checked={this.state.Lettuce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Lettuce" class="toppingLabel"> Lettuce</label>
                    <br></br>
                    <input name="Tomato" type="checkbox" checked={this.state.Tomato} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Tomato"> Tomato</label>
                    <br></br>
                    <input name="Onion" type="checkbox" checked={this.state.Onion} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Onion"> Onion</label>
                    <br></br>
                    <input name="Mushroom" type="checkbox" checked={this.state.Mushroom} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Mushroom"> Mushroom</label>
                    <br></br>
                    <input name="Hot_Sauce" type="checkbox" checked={this.state.Hot_Sauce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Hot_Sauce"> Hot Sauce</label>
                    <br></br>
                    <input name="Barbeque_Sauce" type="checkbox" checked={this.state.Barbeque_Sauce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Barbeque_Sauce"> Barbeque Sauce</label>
                    <br></br>
                    <input name="Mustard" type="checkbox" checked={this.state.Mustard} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Mustard"> Mustard</label>
                    <br></br>
                    <input name="Ketchup" type="checkbox" checked={this.state.Ketchup} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Ketchup"> Ketchup</label>
                    <br></br>
                    <input name="Pickles" type="checkbox" checked={this.state.Pickles} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Pickles"> Pickles</label>
                    <br></br>
                    <input name="Jalapeno_Peppers" type="checkbox" checked={this.state.Jalapeno_Peppers} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Jalapeno_Peppers"> Jalapeno Peppers</label>
                    <br></br>
                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <input name="additionalInfo" class="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
                </div>
            );
        }else if(this.props.menuItemID == 5){
            // baby burg -> 1 patty, cheese
            formContent=(
                <div>
                    <p>The Baby Burg is a humble 1 patty topped with the finest American cheddar, plus your favorite toppings! Served with home-cut fries!</p>
                    <input name="Lettuce" type="checkbox" checked={this.state.Lettuce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Lettuce"> Lettuce</label>
                    <br></br>
                    <input name="Tomato" type="checkbox" checked={this.state.Tomato} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Tomato"> Tomato</label>
                    <br></br>
                    <input name="Onion" type="checkbox" checked={this.state.Onion} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Onion"> Onion</label>
                    <br></br>
                    <input name="Mushroom" type="checkbox" checked={this.state.Mushroom} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Mushroom"> Mushroom</label>
                    <br></br>
                    <input name="Hot_Sauce" type="checkbox" checked={this.state.Hot_Sauce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Hot_Sauce"> Hot Sauce</label>
                    <br></br>
                    <input name="Barbeque_Sauce" type="checkbox" checked={this.state.Barbeque_Sauce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Barbeque_Sauce"> Barbeque Sauce</label>
                    <br></br>
                    <input name="Mustard" type="checkbox" checked={this.state.Mustard} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Mustard"> Mustard</label>
                    <br></br>
                    <input name="Ketchup" type="checkbox" checked={this.state.Ketchup} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Ketchup"> Ketchup</label>
                    <br></br>
                    <input name="Pickles" type="checkbox" checked={this.state.Pickles} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Pickles"> Pickles</label>
                    <br></br>
                    <input name="Jalapeno_Peppers" type="checkbox" checked={this.state.Jalapeno_Peppers} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Jalapeno_Peppers"> Jalapeno Peppers</label>
                    <br></br>
                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <input name="additionalInfo" class="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
                </div>
            );
        }else if(this.props.menuItemID == 6){
            // filling burg -> 2 patty, cheese, bacon
            formContent=(
                <div>
                    <p>The Filling Burg is perfect for an empty tank! Topped with 2 patties, cheese, and bacon, plus your choice of toppings, and our home-cut fries, the Filling Burg is for everyone!</p>
                    <input name="Lettuce" type="checkbox" checked={this.state.Lettuce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Lettuce"> Lettuce</label>
                    <br></br>
                    <input name="Tomato" type="checkbox" checked={this.state.Tomato} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Tomato"> Tomato</label>
                    <br></br>
                    <input name="Onion" type="checkbox" checked={this.state.Onion} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Onion"> Onion</label>
                    <br></br>
                    <input name="Mushroom" type="checkbox" checked={this.state.Mushroom} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Mushroom"> Mushroom</label>
                    <br></br>
                    <input name="Hot_Sauce" type="checkbox" checked={this.state.Hot_Sauce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Hot_Sauce"> Hot Sauce</label>
                    <br></br>
                    <input name="Barbeque_Sauce" type="checkbox" checked={this.state.Barbeque_Sauce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Barbeque_Sauce"> Barbeque Sauce</label>
                    <br></br>
                    <input name="Mustard" type="checkbox" checked={this.state.Mustard} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Mustard"> Mustard</label>
                    <br></br>
                    <input name="Ketchup" type="checkbox" checked={this.state.Ketchup} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Ketchup"> Ketchup</label>
                    <br></br>
                    <input name="Pickles" type="checkbox" checked={this.state.Pickles} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Pickles"> Pickles</label>
                    <br></br>
                    <input name="Jalapeno_Peppers" type="checkbox" checked={this.state.Jalapeno_Peppers} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Jalapeno_Peppers"> Jalapeno Peppers</label>
                    <br></br>
                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <input name="additionalInfo" class="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
                </div>
            );
        }else if(this.props.menuItemID == 7){
            // average joe -> 1 patty, cheese, bacon
            formContent=(
                <div>
                    <p>The Average Joe is built to please. With 1 patty, cheese, and bacon, it's the perfect canvas for your favorite toppings! Served with our home-cut fries.</p>
                    <input name="Lettuce" type="checkbox" checked={this.state.Lettuce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Lettuce"> Lettuce</label>
                    <br></br>
                    <input name="Tomato" type="checkbox" checked={this.state.Tomato} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Tomato"> Tomato</label>
                    <br></br>
                    <input name="Onion" type="checkbox" checked={this.state.Onion} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Onion"> Onion</label>
                    <br></br>
                    <input name="Mushroom" type="checkbox" checked={this.state.Mushroom} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Mushroom"> Mushroom</label>
                    <br></br>
                    <input name="Hot_Sauce" type="checkbox" checked={this.state.Hot_Sauce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Hot_Sauce"> Hot Sauce</label>
                    <br></br>
                    <input name="Barbeque_Sauce" type="checkbox" checked={this.state.Barbeque_Sauce} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Barbeque_Sauce"> Barbeque Sauce</label>
                    <br></br>
                    <input name="Mustard" type="checkbox" checked={this.state.Mustard} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Mustard"> Mustard</label>
                    <br></br>
                    <input name="Ketchup" type="checkbox" checked={this.state.Ketchup} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Ketchup"> Ketchup</label>
                    <br></br>
                    <input name="Pickles" type="checkbox" checked={this.state.Pickles} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Pickles"> Pickles</label>
                    <br></br>
                    <input name="Jalapeno_Peppers" type="checkbox" checked={this.state.Jalapeno_Peppers} onChange={this.handleCheckboxChange}></input>
                    <label htmlFor="Jalapeno_Peppers"> Jalapeno Peppers</label>
                    <br></br>
                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <input name="additionalInfo" class="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
                </div>
            );
        }

        return (
            <div>
                <div class="modal-body">
                    <form id={"menu-form"+this.props.menuItemID} onSubmit={() => this.props.handleSubmit(event, this.props.restaurantName, this.props.menuItemName, this.props.menuItemPrice, this.state, this.props.menuModalID, this.props.menuItemID, this.props.menuImageLink, this.clearState)}>
                        {formContent}
                    </form>
                </div>
                <div class="modal-footer">
                    <input type="button" name="cancelItem" value="Cancel" onClick={() => this.handleCancel(this.props.menuItemID)} class="btn btn-secondary" data-dismiss="modal"></input>
                    <input type="submit" class="btn btn-primary" value="Add to order" form={"menu-form"+this.props.menuItemID} onClick={() => this.props.cancelItem(this.props.menuItemID)}></input>
                </div>
            </div>
        )
    }
}

class CheckoutButton extends React.Component {
  	constructor(props) {
		super(props);
		this.state = { checkedout: false };
  	}
    
    handleClick = () => {
		this.setState({ checkedout: true })
	}

    render() {
        if (this.state.checkedout) {
            return 'You are viewing this restaurant! Find a way to get this into the menu column.';
        }

        // RESEARCH WHAT THE 'e' FUNCTION IS.
        // Research what the properties (such as onClick) mean.
        return <button onClick = {this.handleClick}>Restaurant 1</button>
    }
}

const domContainer = document.querySelector('#ordering-page-container');
ReactDOM.render(e(OrderingSystem), domContainer);