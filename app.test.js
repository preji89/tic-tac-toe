function setupDom() {
  document.body.innerHTML = `
    <p id="status" aria-live="polite">Player X's turn</p>
    <div id="board" class="board">
      <button class="cell" data-index="0"></button>
      <button class="cell" data-index="1"></button>
      <button class="cell" data-index="2"></button>
      <button class="cell" data-index="3"></button>
      <button class="cell" data-index="4"></button>
      <button class="cell" data-index="5"></button>
      <button class="cell" data-index="6"></button>
      <button class="cell" data-index="7"></button>
      <button class="cell" data-index="8"></button>
    </div>
    <button id="resetButton" aria-label="Reset the game">Reset</button>
  `;
}

function loadApp() {
  jest.resetModules();
  setupDom();
  return require("./app.js");
}

const cells = () => document.querySelectorAll(".cell");
const statusText = () => document.getElementById("status");

describe("checkWin", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });

  test("detects a winning row", () => {
    app.board[0] = "X";
    app.board[1] = "X";
    app.board[2] = "X";
    expect(app.checkWin("X")).toBe(true);
    expect(app.checkWin("O")).toBe(false);
  });

  test("detects a winning column", () => {
    app.board[0] = "O";
    app.board[3] = "O";
    app.board[6] = "O";
    expect(app.checkWin("O")).toBe(true);
  });

  test("detects a winning diagonal", () => {
    app.board[0] = "X";
    app.board[4] = "X";
    app.board[8] = "X";
    expect(app.checkWin("X")).toBe(true);
  });

  test("returns false when there is no winning combination", () => {
    app.board[0] = "X";
    app.board[1] = "O";
    app.board[2] = "X";
    expect(app.checkWin("X")).toBe(false);
    expect(app.checkWin("O")).toBe(false);
  });
});

describe("isBoardFull", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });

  test("returns false when cells are empty", () => {
    expect(app.isBoardFull()).toBe(false);
  });

  test("returns true when every cell is filled", () => {
    app.board.fill("X");
    expect(app.isBoardFull()).toBe(true);
  });
});

describe("cell click handling", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });

  test("marks the clicked cell for the current player and hands off the turn", () => {
    cells()[0].click();

    expect(app.board[0]).toBe("X");
    expect(cells()[0].textContent).toBe("X");
    expect(cells()[0].disabled).toBe(true);
    expect(statusText().textContent).toBe("Player O's turn");
  });

  test("alternates players across successive moves", () => {
    cells()[0].click(); // X
    cells()[1].click(); // O

    expect(app.board[0]).toBe("X");
    expect(app.board[1]).toBe("O");
    expect(statusText().textContent).toBe("Player X's turn");
  });

  test("declares a winner and disables the rest of the board", () => {
    cells()[0].click(); // X
    cells()[3].click(); // O
    cells()[1].click(); // X
    cells()[4].click(); // O
    cells()[2].click(); // X completes the top row

    expect(statusText().textContent).toBe("X wins!");
    cells().forEach((cell) => expect(cell.disabled).toBe(true));
  });

  test("declares a draw when the board fills with no winner", () => {
    // Final board:
    // X O X
    // X O O
    // O X X
    const clickOrder = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    clickOrder.forEach((index) => cells()[index].click());

    expect(app.isBoardFull()).toBe(true);
    expect(statusText().textContent).toBe("It's a draw!");
  });
});

describe("resetBoard", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });

  test("clears the board state and re-enables every cell", () => {
    cells()[0].click();
    cells()[1].click();

    app.resetBoard();

    expect(app.board.every((mark) => mark === "")).toBe(true);
    cells().forEach((cell) => {
      expect(cell.disabled).toBe(false);
      expect(cell.textContent).toBe("");
    });
  });

  test("is wired up to the reset button", () => {
    cells()[0].click();

    document.getElementById("resetButton").click();

    expect(app.board.every((mark) => mark === "")).toBe(true);
    cells().forEach((cell) => expect(cell.disabled).toBe(false));
  });
});

describe("disableBoard", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });

  test("disables every cell", () => {
    app.disableBoard();
    cells().forEach((cell) => expect(cell.disabled).toBe(true));
  });
});
