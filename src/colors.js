function generateColors(n) {
    const colors = [];
    for (let i = 0; i < n; i++) {
      colors.push(random_bg_color());
    }
    return colors;
  }
  
  function random_bg_color() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var bg = "rgb(" + x + "," + y + "," + z + ")";
    
    var brightness = (x * 299 + y * 587 + z * 114) / 1000;
    var fg = brightness > 128 ? "black" : "white";
    
    return {bg: bg, fg: fg};
  }
  random_bg_color();
  

  export default generateColors;