import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';


class App extends Component {

  // constructor(props) {
  //   super(props);

  //   this.state = {manager :''};
  // }

// above and below 'state' are the same

  state = {
    manager : '',
    players : [],
    balance : '',
    value : '',
    message : ''
  };

  // "componentDidMount" ::  function is provided by reactJS and it called only once during react life cycle

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    //lottery.options.address -> contract address
    console.log(manager,players,balance,lottery.options.address);

    this.setState({
      manager : manager, 
      players : players,
      balance : balance
    });

  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message : 'Waiting on transaction success...'});
    console.log(this.state.value);
    await lottery.methods.enter().send({
      from : accounts[0],
      value : web3.utils.toWei(this.state.value,'ether')
    });

    this.setState({message : 'You Have been Entered!!!'});

    const players = await lottery.methods.getPlayers().call();
    const balanceAtContract = await web3.eth.getBalance(lottery.options.address);

    this.setState({balance : balanceAtContract});
    this.setState({players: players});

  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({
      message : 'Waiting on transaction success...'
    });

    //one internal transaction is happening sending fund to winner
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({
      message : 'A Winner has been picked'
    });

  };

  getLastWinner = async () => {
    const lastWinner = await lottery.methods.nameOfLastWinner().call();
    console.log(lottery.methods);
    this.setState({
      message : 'Last Winner Ether Address is '+ lastWinner
    });
  };

  render() {
    // web3.eth.getAccounts()
    //     .then(function(data){
    //       console.log(data);
    //     });
    return (
      <div>
          <h2>Lottery Contract</h2>
          <pre>
            This Contract is managed by {this.state.manager} and 
             There are Currently {this.state.players.length} people entered
            competing to win { web3.utils.fromWei(this.state.balance, 'ether') } ether!
          </pre>

          <hr />
         
          <form onSubmit = {this.onSubmit}>
                <h4> Try Your Luck</h4>
                <div>
                  <label> Amount of ether to enter </label>
                      <input value = {this.state.value}
                       onChange = {(event) => {
                        this.setState({
                          value: event.target.value
                        });
                      }} />
                </div>  
                <button> Enter </button>  
          </form>

          <hr />

          <h4> Ready to Pick a Winner </h4>
          <button onClick={this.onClick}> Click </button>

          <hr />

            <h4> See the Last Winner Name </h4>
            <button onClick={this.getLastWinner}> Click </button>

          <hr />

          <h1> {this.state.message}</h1>

      </div>
    );
  }
}

export default App;
