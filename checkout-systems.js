'use strict';
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

var banner = document.createElement('p');
banner.style ='margin:30px ; display: block;';
var line = document.createElement('a');
banner.innerHTML= '<a id = "GoBack" class="header-link" href="./dashboard-loggedin.html"> < MY ORDER</a>';

document.body.insertBefore(banner,document.body.childNodes[0]);

const e = React.createElement;
class CheckoutSystem extends React.Component {
    
    constructor(props){
        super(props);
        const searchParams = new URLSearchParams(window.location.search);
        var i = 0;
        var newOrders = [];
        var newImages = [];
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
            i= i +1;
       }
       console.log(JSON.stringify(newImages, null, 4));
    
       this.state={
        orders: newOrders,
        myAddress: "123 Proto St, City, MB, XYZ 3ME",
        myTime: "As soon as possible",
        myPaymentType: null,
        myInstructions: null,
        orderImages: newImages,
       };
       this.handleChange=this.handleChange.bind(this);
       this.handlemyAddress = this.handlemyAddress.bind(this);
       this.goPay = this.goPay.bind(this);

    }
    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }
    handlemyAddress(event, newSelected){
        event.preventDefault();
        this.setState({myAddress:newSelected});
        $("#editModal").modal('hide');
    }
    addOrderlistFromURL(){
        const searchParams = new URLSearchParams(window.location.search);
        var i = 0;
        var newOrders = [];
        while (decodeURIComponent(searchParams.get(i)) !="null") 
       {
            var name = decodeURIComponent(searchParams.get(i))
            var obj = JSON.parse(name);
            var orderobj = obj.props;
            newOrders = newOrders.concat(<OrderItem orderRestaurantName = {orderobj.orderRestaurantName} orderItemName = {orderobj.orderItemName} orderItemCost = {orderobj.orderItemCost} orderItemNotes={orderobj.orderItemNotes}/>);

            i= i +1;
       }
       const combinedOrders = this.state.orders.concat(newOrders);
       this.setState({orders: combinedOrders});
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
    goPay(){
        var query= this.objectToQuerystring(this.state.orders);
        window.location.href = "dashboard-loggedin.html";
        
    }
    saveOrder(){
        alert("This order has been saved! (Or at least it would be if this were a functioning application!)");

    }
    
    render(){
        let orderTotal = 0.0;

        for(let i = 0; i < this.state.orders.length; i++){
            orderTotal += parseFloat(this.state.orders[i].props.orderItemCost);
        }
         var goBack= "< MY ORDER";
         var query= this.objectToQuerystring(this.state.orders);
         var outerhtmlTag= document.getElementById('GoBack');    
         outerhtmlTag.href = "ordering-page.html" + query;
        return (
        <div class="container">
            <div class="row">
                <div class="col-lg">
                    <ImageTray orderImages={this.state.orderImages} />
                </div>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <MyInfoColumn infoMyAddress = {this.state.myAddress} infoMyTime = {this.state.myTime} infoMyPaymentType = {this.state.myPaymentType} infoMyInstructions = {this.state.myInstructions} handleClick={this.handlemyAddress}/>
                    
                </div>
                <div class="col-md-4" >
                    <OrderColumn orders = {this.state.orders} total= {orderTotal} handleSaveOrder ={this.saveOrder} handleGoPay ={this.goPay}/>
                    </div>
            </div>
           
        </div>
        );
    }
}



class MyInfoColumn extends React.Component {
    constructor(props){
        super(props);
        this.state={
            myAddress: this.props.infoMyAddress,
            myTime: this.props.infoMyTime,
            myPaymentType: this.props.infoMyPaymentType,
            myInstructions: this.props.infoMyInstructions,
        };
        this.handleChange=this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }
    render(){
        const infoMyAddress = this.props.infoMyAddress;
        const infoMyTime = this.props.infoMyTime;
        const infoMyPaymentType= this.props.infoMyPaymentType;
        const infoMyInstructions= this.props.infoMyInstructions;
        var temp = "";
        return (
        <div>
            <div class="row">
                <h2>My Info</h2>

            </div>
                <div class="row">
                    <div class="col-md-3 text-right">
                        <strong>Delivery Adress:</strong>
                    </div>  
                    <div class="col-md-5 text-left">
                        {infoMyAddress}&nbsp;
                        
                        <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#editModal">Edit</button>
                        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="newsModalLabel" aria-hidden="true">
		                    <div class="modal-dialog" role="document">
			                    <div class="modal-content">
				                    <div class="modal-header">
					                    <h5 class="modal-title" id="newsModalLabel">Edit</h5>
					                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
						                    <span aria-hidden="true">&times;</span>
					                    </button>
				                    </div>
				                    <div class="modal-body">
					                    <h2>Enter your new address:</h2>
                                        <form id="address" onSubmit={()=> this.props.handleClick(event, this.state.myAddress)}>
                                            <input name="myAddress" class="form-control" type="text" onChange={this.handleChange}/>
                                        </form>
				                    </div>
				                    <div class="modal-footer">
					                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <input id="address-submit-button" type="submit" value="Save" class="btn btn-primary" form="address"></input>
				                    </div>
			                    </div>
		                    </div>
	                    </div>
                    </div>
                    <div class="col-md-4 text-left">
                    </div>    
                </div>
            <br></br>
            <br></br>
            <div class="row">
                <div class="col-md-3 text-right">
                        <strong>Desired Time:</strong>
                </div>  
                <div class="col-md-9 text-left">
                    <select name="infoMyTime" class="form-control-xs"  onChange={this.handleChange}>
                            <option value="As soon as possible">As soon as possible</option>
                            <option value="in 30 minutes">in 30 minutes</option>
                            <option value="in 1 hour">in 1 hour</option>
                            <option value="in 1 hour and 30 minutes">in 1 hour and 30 minutes</option>
                            <option value="in 2 hours">in 2 hours</option>
                    </select>   
                </div>   
            </div>
            <br></br>
            <br></br>
            <div class="row">
                <div class="col-md-3 text-right">
                        <strong>Payment Type:</strong>
                </div>  
                <div class="col-md-9 text-left">
                    <select name="infoMyTime" class="form-control-xs" onChange={this.handleChange}>
                        <option value="Visa">Visa</option>
                        <option value="Debit">Debit</option>
                        <option value="MasterCard">Mastercard</option>
                        <option value="Paypal">Paypal</option>
                    </select> 
                </div>   
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div class="row">
                <div class="col-md-9 text-left">
                    <label htmlFor="myInstructions">Additional Instructions:</label>
                    <textarea name="myInstructions" class="form-control" id="myInstructions" placeholder="Special instructions for the driver" rows="4"></textarea>
                    <small id="instructionHelp" class="form-text text-muted">* The delivery staff are not responsible for preparing your food</small>
                </div>
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
                <tbody>
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
                </tbody>
            </table>
        </div>
        );
    }
}
class OrderColumn extends React.Component {
    render(){
        return (
            <div>
                <div class="col-md column-header">
                    <h2>Order</h2>
                </div>
                <div class="col-md ordering-column">
                    {this.props.orders}
                </div>
                <table>
                    <tr>
                        <td class="order-item-name">Total:</td>
                        <td> <h2> &nbsp;${Number((this.props.total).toFixed('2'))}</h2>
                        
                        </td>
                    </tr>
                </table>  
                <table>
                    <tr>
                        <td class="order-item-name"> <input type="button" name="Save" value="Save Order" onClick={() => this.props.handleSaveOrder()} class="btn btn-secondary text-left" ></input>
                        </td>
                        <td> <input type="button" name="Pay" value="Pay" onClick={() => this.props.handleGoPay()} class="btn btn-primary text-right" ></input></td>
                    </tr>
                </table>
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
const domContainer = document.querySelector('#checkout-container');
ReactDOM.render(e(CheckoutSystem), domContainer);
