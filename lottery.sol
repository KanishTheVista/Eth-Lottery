pragma solidity ^0.4.17;


//'msg,bolck,now' are global variables.
//'require' function is by default provided by ethereum solidity it 
//is used for validating the data or inputs.


contract Lottery {
    address public manager;
    address[] public players;
    address public lastWinner;

    constructor () public {
        manager = msg.sender;
    }

    function enter() public payable {
        // msg.val tell how much ether amount 
        // sent by sender
        // if we don't write (0.01 ether) then by defaut its value in 'wei'
        
        require(msg.value > 0.01 ether); 

        //msg.sender tells about sender address

        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));   
    }

    //pickWinner works when it calls from manager account
    function pickWinner() public restricted{
        uint index = random() % players.length;
	    lastWinner = players[index];
        players[index].transfer(this.balance); 
        //'this.balance' gives the balance stored at contract
        players = new address[](0);
        //after picking the winner we are re-intialzing the address to empty 
        //so that we can reset the lotter game
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns(address[]) {
        return players;
    }

    function nameOfLastWinner() public view returns(address) {
	   return lastWinner;
    }


}
