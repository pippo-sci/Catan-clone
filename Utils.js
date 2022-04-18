// AUx functions
export const randomRange = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const drawHexagon = (ctx, x, y, r) => {

    const a = 2 * Math.PI / 6;
    const coords = [];
    ctx.save()
    ctx.translate(x, y);
    ctx.rotate(90 / 180 * Math.PI);
    ctx.beginPath();
    let tx, ty;
    for (let i= 0; i < 6; i++){
        tx = r * Math.cos(a * i);
        ty = r * Math.sin(a * i);
        ctx.lineTo(tx, ty);
        coords.push({x: tx, y: ty});
    }
    
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    return coords;
}


export const rotate = (x, y, xo, yo, theta) => {
    theta *= Math.PI /180;
    const xr = Math.cos(theta) * (x-xo) - Math.sin(theta) * (y-yo) + xo;
    const yr = Math.sin(theta) * (x-xo) + Math.cos(theta) * (y-yo) + yo;
    return {x: xr, y: yr};
}