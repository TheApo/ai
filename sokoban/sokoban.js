const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
let boxSize = 40; // Größe jeder Box
const levels = [
	[
	'#######',
	'#@   .#',
	'# $   #',
	'#   ###',
	'#####  ',
	],
	[
        '#####  ',
        '#@  #  ',
        '# #$###',
        '# $ ..#',
        '#######',
    ],
	[
        '  #####',
		'###   #',
		'# $ # ##',
		'# #  . #',
		'#    # #',
		'## #   #',
		' #@  ###',
		' #####',
    ],
	[
        '######',
		'#    #',
		'# #@ #',
		'# $* #',
		'# .* #',
		'#    #',
		'######',
    ],
	[
		'########',
		'#      #',
		'# .**$@#',
		'#      #',
		'#####  #',
		'    ####',	
	],
	[
        '  #####',
        '###   #',
        '# $ # ##',
        '# #  . #',
        '# .  # #',
        '##$#.$ #',
        ' #@  ###',
        ' #####',
    ],
	[
        '    #####          ',
        '    #   #          ',
        '    #$  #          ',
        '  ###  $##         ',
        '  #  $ $ #         ',
        '### # ## #   ######',
        '#   # ## #####  ..#',
        '# $  $          ..#',
        '##### ### #@##  ..#',
        '    #     #########',
        '    #######        '
    ],
	[
		'####',
		'# .#',
		'#  ###',
		'#*@  #',
		'#  $ #',
		'#  ###',
		'####',
	],
	[
	' ######',
	'##  . #',
	'# $ # #',
	'# .$  #',
	'#  #$##',
	'#. @ #',
	'######',
	],
	[
	'#######',
	'#.  @ #',
	'# #.# #',
	'#   $ #',
	'#.$$ ##',
	'#  ###',
	'####',
	],
	[
	'#### ####',
	'#  ###  #',
	'# $ * $ #',
	'#   .   #',
	'### .$###',
	'  # + #  ',
	'  #####  ',
	],	
	[
		'  ####',
		'###  ####',
		'#     $ #',
		'# #  #$ #',
		'# . .#@ #',
		'#########',
    ],
    [
        '############',
        '#..  #     ###',
        '#..  # $  $  #',
        '#..  #$####  #',
        '#..    @ ##  #',
        '#..  # #  $ ##',
        '###### ##$ $ #',
        '  # $  $ $ $ #',
        '  #    #     #',
        '  ############'
    ],
    [
        '        ######## ',
        '        #     @# ',
        '        # $#$ ## ',
        '        # $  $#  ',
        '        ##$ $ #  ',
        '######### $ # ###',
        '#....  ## $  $  #',
        '##...    $  $   #',
        '#....  ##########',
        '########         '
    ],
    [
        '           ########',
        '           # .....#',
        '############ .....#',
        '#    #  $ $   ....#',
        '# $$$#$  $ #  ....#',
        '#  $     $ # .....#',
        '# $$ #$ $ $########',
        '#  $ #     #       ',
        '## $ $ ##  #       ',
        ' #    # $$#       ',
        ' #  $ $   #       ',
        ' ###$ $ @ #       ',
        '   #    # #       ',
        '   ########       '
    ],
];

let history = [];
let playerPosition = { x: 0, y: 0 };
let boxes = [];
let targets = [];
let walls = [];
let currentLevel = 0;
let steps = 0;

let gameWon = false;

const isWalkable = (x, y) => {
    const row = levels[currentLevel][y];
    if (!row || x < 0 || x >= row.length) return false;
    const cell = row.charAt(x);
    return cell !== '#';
};

const isBoxAtPosition = (x, y) => {
    return boxes.some(box => box.x === x && box.y === y);
};

const isTargetAtPosition = (x, y) => {
    return targets.some(target => target.x === x && target.y === y);
};

const moveBox = (fromX, fromY, toX, toY) => {
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].x === fromX && boxes[i].y === fromY) {
            boxes[i].x = toX;
            boxes[i].y = toY;
            return;
        }
    }
};

const movePlayer = (dx, dy) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    if (isWalkable(newX, newY)) {
        if (isBoxAtPosition(newX, newY)) {
            const nextBoxX = newX + dx;
            const nextBoxY = newY + dy;
            if (isWalkable(nextBoxX, nextBoxY) && !isBoxAtPosition(nextBoxX, nextBoxY)) {
                moveBox(newX, newY, nextBoxX, nextBoxY);
                playerPosition.x = newX;
                playerPosition.y = newY;
				steps++;
            }
        } else {
            playerPosition.x = newX;
            playerPosition.y = newY;
			steps++;
        }
		// Save the current state to history
        history.push({
            player: { ...playerPosition },
            boxes: boxes.map(box => ({ ...box }))
        });
    }
    drawGame();
    if (isLevelCompleted()) {
        gameWon = true;
        drawGame();
    }
};

const isLevelCompleted = () => {
    return boxes.every(box => isTargetAtPosition(box.x, box.y));
};

const drawGame = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < levels[currentLevel].length; y++) {
        for (let x = 0; x < levels[currentLevel][y].length; x++) {
            const cell = levels[currentLevel][y].charAt(x);
            context.fillStyle = cell === '#' ? 'grey' : 'white';
            context.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
            context.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);
            
        }
    }
    boxes.forEach(box => {
        context.fillStyle = 'green';
		context.fillRect(box.x * boxSize, box.y * boxSize, boxSize, boxSize);
		context.strokeStyle = 'black';
		context.strokeRect(box.x * boxSize, box.y * boxSize, boxSize, boxSize);
    });
	targets.forEach(target => {
		context.strokeStyle = 'black';
		context.beginPath();
		context.moveTo(target.x * boxSize, target.y * boxSize);
		context.lineTo((target.x + 1) * boxSize, (target.y + 1) * boxSize);
		context.moveTo((target.x + 1) * boxSize, target.y * boxSize);
		context.lineTo(target.x * boxSize, (target.y + 1) * boxSize);
		context.stroke();
	});
    context.fillStyle = 'red';
    context.beginPath();
    context.arc((playerPosition.x + 0.5) * boxSize, (playerPosition.y + 0.5) * boxSize, boxSize / 2, 0, Math.PI * 2, true);
    context.fill();
	
	context.font = '20px Arial';
	context.fillStyle = 'white';
    context.fillRect(5, 1, 130, 30);
	context.fillRect(canvas.width - 5 - 120, 1, 120, 30);
    context.fillRect(5, canvas.height - 31, 130, 30);
	context.fillRect(canvas.width - 5 - 190, canvas.height - 31, 190, 30);
	context.strokeStyle = 'black';
	context.strokeRect(5, 1, 130, 30);
	context.strokeRect(canvas.width - 5 - 120, 1, 120, 30);
    context.strokeRect(5, canvas.height - 31, 130, 30);
	context.strokeRect(canvas.width - 5 - 190, canvas.height - 31, 190, 30);
    context.fillStyle = 'black';
    context.fillText(`Level: ${currentLevel + 1} / ${levels.length}`, 10, 23);
    context.fillText(`Steps: ${steps}`, canvas.width - 120, 23);
	
    context.fillText('r - Neustart', 10, canvas.height - 8);
    context.fillText('n - Naechstes Level', canvas.width - 190, canvas.height - 8);
	
	if (gameWon) {
		const longText = 'Druecken Sie Enter, um ein neues Level zu starten!';
		for (let i = 0; i < 2; i++) {
			let congratulations = 'Herzlichen Glueckwunsch.';
			if (i == 1) {
				congratulations = longText;
			}
			let textWidth = context.measureText(congratulations).width;
			let textX = (canvas.width - textWidth) / 2;
			let textY = canvas.height / 2;

			if (i == 0) {
				textWidth = context.measureText(longText).width;
				textX = (canvas.width - textWidth) / 2;
				textY = canvas.height / 2;
				context.fillStyle = 'white';
				context.fillRect(textX - 5, textY - 60 / 2, textWidth + 10, 60); // Hintergrund
				context.strokeStyle = 'black';
				context.strokeRect(textX - 5, textY - 60 / 2, textWidth + 10, 60); // Hintergrund
			}
			context.fillStyle = 'black';
			context.fillText(congratulations, textX, textY - 10 + i * 25);
		}
    }
	
	
	
};

const loadLevel = () => {
    walls = [];
    boxes = [];
    targets = [];
	history = [];
	gameWon = false;
	steps = 0;
    const level = levels[currentLevel];
	let maxWidth = 0;
    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < level[y].length; x++) {
            const cell = level[y].charAt(x);
            if (cell === '#') {
                walls.push({ x, y });
            } else if (cell === '$') {
                boxes.push({ x, y });
            } else if (cell === '.') {
                targets.push({ x, y });
            } else if (cell === '*') {
                boxes.push({ x, y });
                targets.push({ x, y });
            } else if (cell === '@') {
                playerPosition = { x, y };
            } else if (cell === '+') {
                playerPosition = { x, y };
                targets.push({ x, y });
            }
        }
		maxWidth = Math.max(maxWidth, level[y].length);
    }
    boxSize = Math.min(Math.floor(640 / maxWidth), Math.floor(480 / level.length));
    drawGame();
};

const gameWonFunction = () => {
    currentLevel = (currentLevel + 1) % levels.length;
    loadLevel();
    gameWon = false;
};

window.addEventListener('keydown', event => {
	if (gameWon && (event.key === 'Enter' || event.key === ' ')) {
        gameWonFunction();
    }
	if (gameWon) {
		return;
	}
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
        case 'r':
            loadLevel();
            break;
        case 'p':
			currentLevel = (currentLevel - 1) % levels.length;
			if (currentLevel < 0) currentLevel = levels.length - 1;
            loadLevel();
            break;
        case 'n':
			currentLevel = (currentLevel + 1) % levels.length;
            loadLevel();
            break;
		case 'u':
            if (history.length > 1) {
                history.pop(); // Remove the current state
                const previousState = history[history.length - 1];
                playerPosition = previousState.player;
                boxes = previousState.boxes;
				steps -= 1;
                drawGame();
            } else {
				loadLevel();
			}
            break;
    }
});

window.addEventListener('touchstart', event => {
	if (gameWon) {
        gameWonFunction();
    }
});

loadLevel();