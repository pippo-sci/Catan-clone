// AUx functions
export const randomRange = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const drawHexagon = (ctx, x, y, r) => {

    const a = 2 * Math.PI / 6;
    const corners = [];
    const edgeCentre = [];
    ctx.save()
    ctx.translate(x, y);
    ctx.rotate(90 / 180 * Math.PI);
    ctx.beginPath();
    let tx, ty, cx, cy, midx, midy;

    for (let i= 0; i < 6; i++){
        cx = r * Math.cos(a * i);
        cy = r * Math.sin(a * i);
        if (i > 0){
            midx = tx + (cx - tx) * 0.5;
            midy = ty + (cy - ty) * 0.5;
            edgeCentre.push({x: midx, y:midy});
        };
        tx = cx; 
        ty = cy;
        ctx.lineTo(tx, ty);
        corners.push({x: tx, y: ty});
    }
    
    midx = tx + (r - tx) * 0.5;
    midy = ty + (0 - ty) * 0.5;
    ctx.lineTo(r, 0);
    edgeCentre.push({x: midx, y:midy});
    
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    return [corners, edgeCentre];
}


export const rotate = (x, y, xo, yo, theta) => {
    theta *= Math.PI /180;
    const xr = Math.cos(theta) * (x-xo) - Math.sin(theta) * (y-yo) + xo;
    const yr = Math.sin(theta) * (x-xo) + Math.cos(theta) * (y-yo) + yo;
    return {x: xr, y: yr};
}