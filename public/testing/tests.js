var assert = chai.assert;
describe('Snake tests', function () {
  it('Canvas is bigger than its starting value', function () {
    assert.isAbove(CANVAS_SIZE, 5, 'Canvas size is not greater thans 5');
  });
  it('Snake moves faster', function () {
    assert.isBelow(Window.Game.frameCounterLimit, 30, 'frameCounterLimit is not decreased');
  });
  it('Gain points after eating an apple', function () {
    const scoreBefore = Window.Game.score.score;
    Window.Game.eatApple();
    assert.isAbove(Window.Game.score.score, scoreBefore, 'Score is not increased');
  });
  it('Handles up key', async function () {
    await triggerKeyboardEvent(KEY_UP)
    assert.equal(snake.dy, -CELL_SIZE)
  })
  it('Handles left key', async function () {
    await triggerKeyboardEvent(KEY_LEFT)
    assert.equal(snake.dx, -CELL_SIZE)
  })
  it('Handles down key', async function () {
    await triggerKeyboardEvent(KEY_DOWN)
    assert.equal(snake.dy, CELL_SIZE)
  })
  it('Handles right key', async function () {
    await triggerKeyboardEvent(KEY_RIGHT)
    assert.equal(snake.dx, CELL_SIZE)
  })
  it('Resets the game when the snake collides with the edge', function() {
    assert.equal(Window.Game.pauze.pauze, true, 'GameOver() is not called when the snake collides with the edge')
  })
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
    }, 1000);
    })
   }
  