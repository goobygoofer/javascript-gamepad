const write_sheet = new Image();
write_sheet.src="./write.png";
function write(text, fontsize, context, x, y){
  text=text.toUpperCase();
  for (char in text){
    let charInt = text[char].charCodeAt() - 65;
    let spriteY = 10;
    let offset = 0;
    if (charInt>=13 && charInt<=26){
      //letter
      charInt-=13;
      spriteY=20;
      offset=1;
    }
    else if (charInt < 0){
      //number
      charInt+=17;
      spriteY=0;
    }
    context.drawImage(write_sheet, charInt*8 + offset, spriteY, 8, 9, x+8*char*fontsize, y, 8*fontsize, 10*fontsize);
  }
}