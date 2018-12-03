var snake, apple, squareSize, score, speed, updateDelay, direction, new_direction,
addNew, cursors, scoreTexteValue, speedTextValue, textStyle_key, textStyle_Value;

var Game = {

    preload : function() {

        game.load.image('snake', 'snake.png');
        game.load.image('apple', 'apple.png');
    },

    create : function() {

        // Setting up global variables, initialise on game start
        // They are global so that the update function can alter them

        snake = [];            //Stack
        apple = {};            //Object
        squareSize = 15;       //Length of one side 15 pixels
        score = 0;             //Score
        speed = 0;             //Speed
        updateDelay = 0;       //Var to controll update rates
        direction = 'right';   //Direction of the snake
        new_direction = null;  //Buffer to stor the direction into
        addNew = false;        //Var used when apple has been eaten

        //Set up phaser controller for KEYboard
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#061f27';

        //generate the initial sneek stack, 10 elements long.
        //Starting at x= 150 y= 150 and increasing the x on every iteration
        //parameters are (x , y , image)
        for(var i = 0; i < 10; i++){
            snake[i] = game.add.sprite(150 + i*squareSize, 150, 'snake')
        }

        //Generate the first apple
        this.generateApple();

        //Add text to top of game
        textStyle_key = {font: "bold 14px sans-serif", fill: "#46c0f9", align:"center"} 
        textStyle_Value = {font: "bold 18px sans-serif", fill: "#fff", align:"center"}   
        
        //Score
        game.add.text(30, 20, "SCORE", textStyle_key);
        scoreTexteValue = game.add.text(90, 18, score.toString(), textStyle_Value);

        //Speed
        game.add.text(500, 20, "SPEED", textStyle_key );
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);
        
    
    },

    update : function() {

        //Is called constantly at a high rate(around 60 fps)

        //updateing the field every time

        if (cursors.right.isDown && direction!= 'left'){
            new_direction = 'right';
        }
        else if (cursors.left.isDown && direction!= 'right'){
            new_direction = 'left';
        }
        else if (cursors.up.isDown && direction!= 'down'){
            new_direction = 'up';
        }
        else if (cursors.down.isDown && direction!= 'up'){
            new_direction = 'down';
        }

        //FORMULA to calculate Speed based on the score.
        //Higher score = higher speed max 10
        speed = Math.min( 10, Math.floor(score/5));

        //update speed value on screen
        speedTextValue.text = '' + speed;

        //increase  conter on every update call
        updateDelay++;

        //Sneek go faster
        if (updateDelay % (10 - speed) == 0){

            //Sneek movment

            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            //if new direction has ben chosen from keyboard, make it the direction of the sneek now.
            if (new_direction){
                direction = new_direction;
                new_direction = null;
            }

            //change the last cells coordinates relative to the head of the snake, according to the direction.
            if (direction == 'right'){
                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            }
            else if (direction == 'left'){
                lastCell.x = firstCell.x -15;
                lastCell.y = firstCell.y;
            }
            else if (direction == 'up'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            }
            else if (direction == 'down'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }
            
            //Place the last cell in the front of the stack
            //mark it the first cell
            snake.push(lastCell);
            firstCell = lastCell;


            //Make sneek bigger
            //Create a block in the vak of the snake with th old position of the previous last block


            if (addNew){
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            //Check apple collision
            this.appleCollision();

            //Check for collision with self,
            this.selfCollision(firstCell);

            //Check with collision with wall
            this.wallCollision(firstCell);

        }
    },
    appleCollision: function() {

        //check if sneek is overlaping the apple

        for (var i = 0; i < snake.length; i++ ){
            if (snake[i].x == apple.x && snake[i].y == apple.y){

                //Next time the snake moves, a block will be added to its length
                addNew = true;

                //MURDER the old apple
                apple.destroy();

                //make a new one
                this.generateApple();

                //score +
                score++;

                //refresh scoreboard
                scoreTexteValue.text = score.toString();
            }
        }
    },

    selfCollision : function(head) {
        //check if head of sneek overlaps with sneek
        for (var i = 0; i <snake.length - 1; i++){
            if (head.x == snake[i].x && head.y == snake[i].y){
                //if yes you loose
                game.state.start('Game_Over');
            }
        }
    },
    wallCollision : function(head) {
        //check if head of sneek is in game field

        if (head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0){

            // if not you loose 
            game.state.start('Game_Over');
        }
    },

    generateApple : function() {

        //Chose a random place on the grid.
        //X is between 0 and 585
        //Y is between 0 435

        var randomX = Math.floor(Math.random() * 40) * squareSize,
            randomY = Math.floor(Math.random() * 30) * squareSize;

        //Add a new apple
        apple = game.add.sprite(randomX, randomY, 'apple')
    }
};