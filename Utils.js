// AUx functions
export const randomRange = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const drawHexagon = (ctx, x, y, r) => {

    const a = 2 * Math.PI / 6;
    const corners = [];
    const edgeCentre = [];
    ctx.save()
    ctx.strokeStyle = 'gray';
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

/**
 * DEPRICATED
 * @param {*} x 
 * @param {*} y 
 * @param {*} w 
 * @param {*} h 
 * @param {*} theta 
 * @returns 
 */
export const rotatedRect = (x, y, w, h, theta) => {
    let r = new Path2D();
    let r2 = new Path2D();
    r2.rect(x, y, w, h);
    let m = new DOMMatrix();
    theta *= Math.PI /180;
    m.a  = Math.cos(theta); m.b = -Math.sin(theta);
    m.c  = Math.sin(theta); m.b = Math.cos(theta);
    r.addPath(r2, m);
    return r;
}


export const rotate = (x, y, xo, yo, theta) => {
    theta *= Math.PI /180;
    const xr = Math.cos(theta) * (x-xo) - Math.sin(theta) * (y-yo) + xo;
    const yr = Math.sin(theta) * (x-xo) + Math.cos(theta) * (y-yo) + yo;
    return {x: xr, y: yr};
}

export const polyNotInList = (context, list, x, y) => {
    
    let flag = true;
    const matchedIndex = [];
    for (let j = 0; j < list.length; j++){
        if(context.isPointInPath(list[j]['shape'], x, y)) {
            flag = false;
            matchedIndex.push(j);
        }
    }
    return [flag, matchedIndex];
}

export const mod = (n, m) => {
    return ((n % m) + m) % m;
  }