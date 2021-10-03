import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.winningSquare ? { color: "#00B2FF" } : null}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, position) {
    return (
      <Square
        winningSquare={this.props.winningSquares.includes(i)}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i, position)}
      />
    );
  }

  generateSquares() {
    return [...Array(3)].map((_, row) => {
      return (
        <div key={row} className="board-row">
          {[...Array(3)].map((_, col) => {
            return this.renderSquare(3 * row + col, `${row + 1}x${col + 1}`);
          })}
        </div>
      );
    });
  }

  render() {
    return this.generateSquares();
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      reversed: true,
    };
  }

  handleClick(i, position) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares, position: position }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const movesDesc = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move}, position: ${history[move].position}`
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner.whoWins}`;
    } else if (!current.squares.includes(null)) {
      status = "Result is a draw!";
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={winner ? winner.winningSquares : []}
            squares={current.squares}
            onClick={(i, position) => this.handleClick(i, position)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {this.state.reversed ? (
            <ol style={{ flexDirection: "column-reverse" }}>{movesDesc}</ol>
          ) : (
            <ol style={{ flexDirection: "column" }}>{movesDesc}</ol>
          )}
          <button 
            className="sort-button"
            onClick={() => {
              this.setState({
                reversed: !this.state.reversed,
              });
            }}
          >
            Sort: {this.state.reversed ? "Descending" : "Ascending"}
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { whoWins: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}
