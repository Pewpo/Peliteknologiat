// I have used this tutorial (https://phaser.io/phaser3/devlog/85) as template for this exercise

// Configuration settings for Game.
var config = 
{
    type: Phaser.AUTO,                          // Rendering type
    parent: 'gamediv',                          // Parent element's id     
    canvasStyle : 'width:100%;height:100%;',    // CSS style for canvas
    backgroundColor: '#4dffc3',                 // background color
    scene:                                      // Scenes.
    [
        {  
            //Start scene
            preload: preload0, 
            create: create0, 
            update: update0, 
            key: 'startscene'
        },
        {
            //Main scene
            preload: preload1,
            create: create1,
            update: update1,
            key: "mainscene"
        },
        {
            //End scene
            preload: preload2,
            create: create2, 
            update: update2,
            key: "endscene"
        },

    ]
};

// -------------------------- //
// ---- Global variables ---- //
// -------------------------- //
var snake;
var food;
var music;
var eatsound;
var score = 0;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);

// ------------------------------------------ //
// ---------Start scene's functions --------- //
// ------------------------------------------ //

// preload0 is called automatically (after init()) when the scene starts.
// This should be used for loading wanted assets.
function preload0() {} 

// create0 is called automatically (after init() and preload()) when the scene starts.
// This should be used for creating wanted gameobjects.
function create0()
{
    // Adds some text to scene.
    this.add.text(430,100,"Matopeli");
    this.add.text(350,150,"Aloita koskettamalla ruutua");
    this.add.text(200,200,"Liikkuminen onnistuu koskettamalla/klikkaamalla pelialuetta");
    this.input.on('pointerdown',cbOnPointerDown0);  // creates new listener "pointerdown" which calls "cbOnPointerDown0" function.
}

// update0 is called once per game step while the scene is running.
function update0() {}

// cbOnPointerDown0 is callback function that starts main scene and stops start scene.
function cbOnPointerDown0(e)
{
    game.scene.start('mainscene');
    game.scene.stop('startscene');
}



// ---------------------------------------- //
//---------Main scene's functions---------- //
//----------------------------------------- //

// preload1 is called automatically (after init()) when the scene starts.
// This should be used for loading wanted assets.
function preload1 ()
{
    // Loads some image and audio assets to scene.
    this.load.image('apple', 'assets/apple.png');
    this.load.image('snake_head', 'assets/snake_head.png');
    this.load.image('snake_body', 'assets/snake_body.png');
    this.load.audio('music','assets/music.mp3');
    this.load.audio('eat','assets/eat.mp3');
}

// create1 is called automatically (after init() and preload()) when the scene starts.
// This should be used for creating wanted gameobjects.
function create1 ()
{
    //Creates new "Food" class
    var Food = new Phaser.Class(
    {
        Extends: Phaser.GameObjects.Image, 
        //Constructor
        initialize: function Food (scene, x, y)
        {
            // Initializes new Food instance.
            Phaser.GameObjects.Image.call(this, scene)
            this.setTexture('apple');
            this.setPosition(x * 16, y * 16);
            this.setDisplaySize(16,16);
            this.setOrigin(0);
            this.total = 0; 
            scene.children.add(this);
        },
        eat: function ()
        {
            this.total++;
            score = this.total;
            eatsound.play();

            // Sets apple to new random position.
            var x = Phaser.Math.Between(0, 39);
            var y = Phaser.Math.Between(0, 29);
            this.setPosition(x * 16, y * 16);
        }

    });
    
    //Creates new "Snake" class. 
    var Snake = new Phaser.Class(
    {
        // Constructor 
        initialize : function Snake (scene, x, y) 
        {
            // Defines x,y coordinates for head's position.
            this.headPosition = new Phaser.Geom.Point(x, y); 
            // A scene level Game Object Factory creates new "Group" game object and adds it to Snake classes "body" property
            this.body = scene.add.group();
            // Creates a new game object and adds it to "body" property's group. Sets created game object to "head" property
            this.head = this.body.create(x * 16, y * 16, 'snake_head'); 
            // Sets the display size of this Game Object.
            this.head.setDisplaySize(16,16);
            // Sets the origin of this Game Object.
            this.head.setOrigin(0);
            // Defines x,y coordinates for tail's position.
            this.tail = new Phaser.Geom.Point(x, y);
            // Is alive or not
            this.alive = true;
            // Snake's speed
            this.speed = 100;
            // Move time
            this.moveTime = 0;
            // Heading.
            this.heading = RIGHT;
            // Current direction.
            this.direction = RIGHT;
        },
        // Updates snake's movement if allowed.
        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },
        // Function that handles snake's movement.
        move: function (time)
        {
            /**
            * Based on the heading property (which is the direction the pgroup pressed)
            * we update the headPosition value accordingly.
            * 
            * The Math.wrap call allow the snake to wrap around the screen, so when
            * it goes off any of the sides it re-appears on the other.
            */
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 65);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 65);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 50);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 50);
                    break;
            }

            //Changes direction.
            this.direction = this.heading;
            // ShiftPosition iterates through the items array changing the position of each element to be that of the element that came before it in the array
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1);             
            //Updates tail's last position.
            var bodyParts = this.body.getChildren();
            var lastPart = bodyParts.length-1;
            this.tail.x = bodyParts[lastPart].x;
            this.tail.y = bodyParts[lastPart].y;
           // hitBody checks if there is collosion between head and body.
            var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);
            if (hitBody)
            {
                // if there is collosion between head and body main scene will be stopped and end scene started.
                this.alive = false;
                game.scene.start('endscene');
                game.scene.stop('mainscene');
                music.stop();
                return false;
            }
            else
            {
                //  Otherwise timer will be updated for the next movement.
                this.moveTime = time + this.speed;
                return true;
            }
        },
        grow: function ()
        {
            // Creates new game object and adds it to body-property's array.
            var newPart = this.body.create(this.tail.x, this.tail.y, 'snake_body');
            newPart.setDisplaySize(16,16);
            newPart.setOrigin(0);
        },
        collideWithFood: function (food)
        {
            //Checks collosions between snakes head and food.
            if (this.head.x === food.x && this.head.y === food.y)
            {
                this.grow();
                food.eat();
                return true;
            }
            else
            {
                return false;
            }
        }
    });
    
    food = new Food(this, 3, 4);
    snake = new Snake(this, 20, 20);
    eatsound = this.sound.add('eat');
    music = this.sound.add('music');
    music.setLoop(true);
    music.play();

    // creates new listener "pointerdown" which calls "cbOnPointerDown1" function
    this.input.on('pointerdown',cbOnPointerDown1);    
}

// update1 method is called once per game step while the scene is running.
// time = The current time.
// deltatime = The delta time in ms since the last frame.
function update1(time, delta)
{
    if (!snake.alive)
        return;
    if (snake.update(time))
        snake.collideWithFood(food);
}

//cbOnPointerDown1 is callback function which checks clicked x,y coordinates and calculates new heading based on that.
function cbOnPointerDown1(e)
{
    var hd = snake.heading;
    if(hd == UP || hd == DOWN)
        snake.heading = (e.x < snake.head.x) ? LEFT : RIGHT; 
    else
        snake.heading = (e.y < snake.head.y) ? UP : DOWN;
}



// ------------------------------------------------ //
// ----------- End scene's functions -------------- //
// ------------------------------------------------ //

// preload2 is called automatically (after init()) when the scene starts.
function preload2(){}

// create2 is called automatically (after init() and preload()) when the scene starts.
function create2()
{
    // adds some text to scene.
    this.add.text(430,100,"Havisit pelin!");
    this.add.text(420,150,"keratyt omenat: "+score);
    this.add.text(350,200,"aloita uusi peli napayttamalla ruutua");
    // creates new listener "pointerdown" which calls function "cbOnPointerDown2"
    this.input.on('pointerdown',cbOnPointerDown2); 
}

// update2 method is called once per game step while the scene is running.
function update2(){}

//cbOnPointerDown2 is callback function that starts new mainscene and stops endscene.
function cbOnPointerDown2(e)
{
    game.scene.start('mainscene');
    game.scene.stop('endscene');
}
