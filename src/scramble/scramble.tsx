export function generateScramble(): string {
    const scramble: Array<string> = [];

    const numMoves = generateRandomInt(30, 20);
    let moves = [0, 0, 0, 0, 0, 0] // track which moves done recently: R, L, U, D, F, B

    while (scramble.length < numMoves) {
        let move = generateRandomInt(6);

        while (moves[move]) {
            move = generateRandomInt(6);
        }

        moves[move] = 1

        if (move === 0 || move === 1) {
            moves = clearMoves(moves, [0, 1]);
        } else if (move === 2 || move === 3) {
            moves = clearMoves(moves, [2, 3]);
        } else if (move === 4 || move === 5) {
            moves = clearMoves(moves, [4, 5]);
        }

        let isPrime = false;
        let isDouble = false;
        const temp = generateRandomInt(3);
        if (temp === 1) {
            isPrime = true;
        } else if (temp == 2) {
            isDouble = true;
        }

        let moveStr = "";
        switch (move) {
            case 0:
                moveStr = "R";
                break;
            case 1:
                moveStr = "L";
                break;
            case 2:
                moveStr = "U";
                break;
            case 3:
                moveStr = "D";
                break;
            case 4:
                moveStr = "F";
                break;
            case 5:
                moveStr = "B";
                break;
        }

        if (isPrime) {
            moveStr += "'";
        } else if (isDouble) {
            moveStr += "2";
        }

        scramble.push(moveStr);
    }

    return scramble.join(" ");
}

function generateRandomInt(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min) + min);
}

function clearMoves(moves: Array<number>, pass: Array<number>): Array<number> {
    for (let i = 0; i < 6; i++) {
        if (pass.indexOf(i) === -1) {
            moves[i] = 0;
        }
    }

    return moves;
}
