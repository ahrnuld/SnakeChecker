var assert = chai.assert;
describe('Snake tests', function () {
  it('Assignment 1: Canvas is bigger than its starting value', function () {
    assert.isAbove(CANVAS_SIZE, 5, 'Canvas size is not greater thans 5');
  });
  it('Assignment 2: Snake moves faster', function () {
    assert.isBelow(Window.Game.framesPerSecond, 60, 'FPS is not decreased');
  });
  it('Assignment 3 1/4: Handles down key', async function () {
    await triggerKeyboardEvent(KEY_DOWN)
    assert.equal(snake.dy, CELL_SIZE)
  })
  it('Assignment 3 2/4: Handles right key', async function () {
    await triggerKeyboardEvent(KEY_RIGHT)
    assert.equal(snake.dx, CELL_SIZE)
  })
  it('Assignment 3 3/4: Handles up key', async function () {
    await triggerKeyboardEvent(KEY_UP)
    assert.equal(snake.dy, -CELL_SIZE)
  })
  it('Assignment 3 4/5: Handles left key', async function () {
    await triggerKeyboardEvent(KEY_LEFT)
    assert.equal(snake.dx, -CELL_SIZE)
  })
  it('Assignment 4: Resets the game when the snake collides with the edge', function() {
    assert.equal(Window.Game.pauze.pauze, false, 'resetGame() is not called when the snake collides with the edge')
  })
  it('Assignment 5: Gain points after eating an apple', function () {
    const scoreBefore = Window.Game.score.score;
    Window.Game.eatApple();
    assert.isAbove(Window.Game.score.score, scoreBefore, 'Score is not increased');
  }); 
 });


 function triggerKeyboardEvent(keyCode){
   return new Promise(function (resolve, reject) {
    var eventObj = document.createEventObject ?
    document.createEventObject() : document.createEvent("Events");
  
    if(eventObj.initEvent){
    eventObj.initEvent("keydown", true, true);
    }
  
    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;
  
    document.body.dispatchEvent ? document.body.dispatchEvent(eventObj) : document.body.fireEvent("onkeydown", eventObj); 
    setTimeout(() => {
      resolve();
    }, 1000/Window.Game.framesPerSecond);
    })
   }
  