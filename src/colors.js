function generateColors(n) {
    const colors = [];
    for (let i = 0; i < n; i++) {
      let bg = Math.floor(Math.random() * 16777215).toString(16);
      let fg = Math.floor(Math.random() * 16777215).toString(16);
      while (contrast(`#${bg}`, `#${fg}`) < 4.5 || colors.some(c => contrast(`#${c.bg}`, `#${fg}`) < 4.5 || contrast(`#${bg}`, `#${c.fg}`) < 4.5)) {
        bg = Math.floor(Math.random() * 16777215).toString(16);
        fg = Math.floor(Math.random() * 16777215).toString(16);
      }
      colors.push({ bg, fg });
    }
    return colors;
  }
  
  function contrast(bgColor, textColor) {
    const bg = getRGB(bgColor);
    const text = getRGB(textColor);
    const l1 = luminance(bg.r, bg.g, bg.b);
    const l2 = luminance(text.r, text.g, text.b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  
  function getRGB(hexColor) {
    const r = parseInt(hexColor.substring(0,2),16);
    const g = parseInt(hexColor.substring(2,4),16);
    const b = parseInt(hexColor.substring(4,6),16);
    return { r, g, b };
  }
  
  function luminance(r,g,b) {
    const a = [r,g,b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  export default generateColors;