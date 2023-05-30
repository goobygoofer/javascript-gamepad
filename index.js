//set up canvas and spritesheet
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


canvas.width=800;
canvas.height=600;

const spritesheet = new Image();
spritesheet.src="./spritesheet.png";

//setup buttons and axes
let gp_buttons = [];
for (i=0;i<16;i++){
  gp_buttons.push( {
    pressed:false,
    lastPress:Date.now(),
    down:false,
  } );
}

let gp_axes = {
  L:{
    x:0,
    y:0,
  },
  R:{
    x:0,
    y:0,
  }
}

//draw functions
function drawGamepad(){
  ctx.drawImage(
    spritesheet,
    pad_sprt.x, pad_sprt.y,
    pad_sprt.width, pad_sprt.height, 
    canvas.width/2-pad_sprt.width/2, canvas.height/2-pad_sprt.height/2, 
    pad_sprt.width, pad_sprt.height);
}

//draw pressed buttons with spritesheet font or default font
function drawPressed(){
  try {//to write in spritesheet font
    let b_count=0;
    for (button in gp_buttons){
      write(`${JSON.stringify(button)} ${JSON.stringify(gp_buttons[button].pressed)}`, 1, ctx, 10, button*15);
      b_count+=1;
    }
    write(`l hat x${JSON.stringify(gp_axes.L.x)} y${JSON.stringify(gp_axes.L.y)}`, 1, ctx, 10, b_count*15);
    write(`r hat x${JSON.stringify(gp_axes.R.x)} y${JSON.stringify(gp_axes.R.y)}`, 1, ctx, 10, b_count*15+12);
  } catch {//write in default font
    let b_count=0;
    for (button in gp_buttons){
      ctx.fillStyle="green";
      ctx.fillText(`${button}: ${gp_buttons[button].pressed}`, 10, button*12+10)
    }
    ctx.fillText(`l hat x${JSON.stringify(gp_axes.L.x)} y${JSON.stringify(gp_axes.L.y)}`, 10, b_count*15);
    ctx.fillText(`l hat x${JSON.stringify(gp_axes.L.x)} y${JSON.stringify(gp_axes.L.y)}`, 10, b_count*15+12);
  }
  //draw pressed buttons on controller, by default controller is centered on canvas
  for (button in gp_buttons){
    if (gp_buttons[button].pressed===true){
      let s = btn_list[button];
      ctx.drawImage(
        spritesheet, s.sprite.x, s.sprite.y,
        s.sprite.width, s.sprite.height, 
        s.loc.x+canvas.width/2-pad_sprt.width/2, s.loc.y+canvas.height/2-pad_sprt.height/2-30,//not sure why but coincidentally -30 corresponds to pad_sprt.y
        s.sprite.width, s.sprite.height);
    }
  }
  //draw location of hats (what is correct terminology here?)
  ctx.fillStyle="red";
  ctx.fillRect(//left hat
    hatL.x+(gp_axes.L.x/1600)+canvas.width/2-pad_sprt.width/2, hatL.y+(gp_axes.L.y/1600)+canvas.height/2-pad_sprt.height/2-30,
    2, 2
  );
  ctx.fillRect(//right hat
    hatR.x+(gp_axes.R.x/1600)+canvas.width/2-pad_sprt.width/2, hatR.y+(gp_axes.R.y/1600)+canvas.height/2-pad_sprt.height/2-30,
    2, 2
  );
}

function drawBackground(){
  ctx.fillStyle="black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//pad connection and handling
let pad_connected = false;
let deadzoneL = 1000;      //L joystick deadzone
let deadzoneR = 1000;      //R joystick deadzone
function handleGamepad(){
  try{//to grab first gamepad
    if (pad_connected===false){
      pad_connected=true;
    }
    const gamepad_1 = navigator.getGamepads()[0];//first gamepad
    //L joystick axes values
    gp_axes.L.x = Math.floor(gamepad_1.axes[0]*16000);
    gp_axes.L.y = Math.floor(gamepad_1.axes[1]*16000);
    //R joystick axes values
    gp_axes.R.x = Math.floor(gamepad_1.axes[2]*16000);
    gp_axes.R.y = Math.floor(gamepad_1.axes[3]*16000);
    //0 out joysticks if within deadzone
    if (gp_axes.L.x<1000 && gp_axes.L.x>-deadzoneL){
      gp_axes.L.x=0;
    }
    if (gp_axes.L.y<1000 && gp_axes.L.y>-deadzoneL){
      gp_axes.L.y=0;
    }
    if (gp_axes.R.x<1000 && gp_axes.R.x>-deadzoneR){
      gp_axes.R.x=0;
    }
    if (gp_axes.R.y<1000 && gp_axes.R.y>-deadzoneR){
      gp_axes.R.y=0;
    }
    //set state of buttons
    for (button in gamepad_1.buttons){
      if (gamepad_1.buttons[button].pressed===true){
        gp_buttons[button].pressed=true;
        gp_buttons[button].lastPress=Date.now();
      }
      if (gp_buttons[button].lastPress + 100 < Date.now()){
        gp_buttons[button].pressed=false;
        gp_buttons[button].lastPress=Date.now();
      }
    }
  } catch {//no gamepad connected/detected
    if (pad_connected===true){
      pad_connected=false;
    }
  }
}

//mainloop - handleGamepad() is only necessary function to get gamepad input
function main(){
  handleGamepad();
  drawBackground();
  drawGamepad();
  drawPressed();
}

//called from body onload, starts main at 60 fps
function run(){
  setInterval(main, 1000/60);
} 