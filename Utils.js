// AUx functions
export const randomRange = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const drawHexagon = (ctx, x, y, r) => {

    const a = 2 * Math.PI / 6;
    ctx.save()
    ctx.translate(x, y);
    ctx.rotate(90 / 180 * Math.PI);
    ctx.beginPath();
    for (let i= 0; i < 6; i++){
        
        ctx.lineTo(r * Math.cos(a * i), r * Math.sin(a * i));
    }
    ctx.fill();
    //ctx.stroke();
    ctx.restore();
}