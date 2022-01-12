// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../OZ/IERC20.sol";
import "../OZ/Ownable.sol";
contract socialIco is Ownable {
     event Bought(uint256 amount);
     mapping (address => uint) tokensBought; 
constructor (){
   tokenContract = 0xfb350676025215C64f4D384676746255B3B223EE; //The official contract address of Social Coin
    }

address tokenContract;
uint price;
uint minLimit;   
uint maxAmount;

/*this function allows us more flexibility and to make sure the contract
 address was setup correctly*/

function setTokenContract (address _tokenContract) external onlyOwner{
  tokenContract = _tokenContract;  
}

//this allows us to chose the price of a single $SOCL in $IOTX

function setPrice (uint _price) external onlyOwner {
  price = _price; 
}

// this is to set the minimum buy limit

function setMinLimit (uint _minLimit) external onlyOwner {
  minLimit = _minLimit*10**18;  
}

//this is to set the maximum amount a single account will be able to buy

function setMaxAmount (uint _maxAmount) external onlyOwner {
  maxAmount = _maxAmount*10**18;  
}

// this is to get the $IOTX balance of the contract to evaluate the acquired value during the ICO

function getBalance () external view returns(uint256){
uint256 balance = address(this).balance;  
return(balance);
}

// this is to get the remaining token balance in the contract

function getTokenBalance() external view returns(uint256){
 uint balance = IERC20(tokenContract).balanceOf(address(this));   
 return(balance);
}

/* this is the actual function called by our website to permit users to buy some 
tokens buy calling the function with some value */

function buy() payable public { 
    uint256 amountToBuy = (msg.value)*price; //price is set in IOTX
    uint256 icoBalance = IERC20(tokenContract).balanceOf(address(this));
    require(amountToBuy >= minLimit, "You need to send more IOTX");
    require(amountToBuy <= icoBalance, "Not enough tokens in the reserve");
    require(tokensBought[msg.sender] + amountToBuy <= maxAmount, "You can't buy that much $SOCL");
    IERC20(tokenContract).transfer(msg.sender, amountToBuy);
    tokensBought[msg.sender]+=amountToBuy;
    emit Bought(amountToBuy);
}

/* this is the function that will allow us to withdraw the $IOTX from 
the contract to use it in the liquidity */
  function withdraw() external onlyOwner {
    address payable _owner = payable (owner());
    _owner.transfer(address(this).balance);    
  }

  receive() external payable {
    }

    fallback() external payable { 

     }

}