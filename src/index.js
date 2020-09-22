import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function Reset(props) {
  return (
    <button 
      className="reset"
      onClick={props.onClick}
    >
      "Reset"
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    var wins = {
      'X': 0,
      'O': 0,
      'TIE': 0};
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      wins: wins,
      winner: null
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    //If game is over, don't change state.
    if (this.state.winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const curWinner = calculateWinner(squares, this.state.winner);

    //If move was winning, calculate update win counts
    if (curWinner) {
      const tmpWinCount = this.state.wins[curWinner] + 1;
      this.setState({
        winner: curWinner,
        wins: {
          ...this.state.wins,
          [curWinner]: tmpWinCount
        }
      });
    }

    //Update current square's state
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  resetBoard() {
    this.setState({
      squares: Array(9).fill(null),
      winner: null,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  renderReset() {
    if (this.state.winner) {
      return (
        <Reset 
          onClick={() => this.resetBoard()}
        />
      );
    }
   }

  render() {
    let status;
    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div>
            {this.renderReset()}
        </div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <div className="score">
          X:{this.state.wins["X"]} O:{this.state.wins["O"]} TIE:{this.state.wins["TIE"]}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares, game_over) {
  if (game_over) {
    return null;
  }
  //All possible win combinations
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  //Check for winners
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  //Check for Draw
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      return null;
    }
  }
  return "TIE";
}