let gl;
let program;
let vertexBuffer;
let colorBuffer;

let scale_x = 1.0;
let scale_y = 1.0;

window.onload = function(){
    let canvas = document.getElementById("canvas3D");
    try { gl = canvas.getContext("webgl2"); }
    catch(e) {}
    if (!gl) {
        alert("Ваш браузер не поддерживает WebGL");
    }

    if(gl){
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        initShaders();
        initBuffers();
        circle();
        checkKeyDown();
    }
}


function initShaders() {
    let fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs');
    let vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs');

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Не удалсь установить шейдеры");
    }

    gl.useProgram(program);

    let a_position = gl.getAttribLocation(program, "a_position");
    let a_color = gl.getAttribLocation(program, "a_color");
    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_color);
    gl.enable(gl.DEPTH_TEST);

    makeMatrix(0.0, 0.0);
}


function  makeMatrix(dx, dy){
    scale_x += dx;
    scale_y += dy;

    let scaleMat = mat4.create();
    mat4.scale(scaleMat, scaleMat, [scale_x, scale_y, 1.0]);

    let u_scale = gl.getUniformLocation(program, "u_scale");
    gl.uniformMatrix4fv(u_scale,false, scaleMat);
}

function getShader(type,id) {
    let source = document.getElementById(id).innerHTML;
    let shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}


function initBuffers() {
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
}


function clear(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}


function circle(){
    clear();

    let circleData = [];
    let colorData = [];

    let rgb = [1.0, 0.0, 0.0];

    for (let i = 0.0; i <= 360; i += 1) {
        let j = i * Math.PI / 180;
        let vert = [
            Math.sin(j),
            Math.cos(j),
        ];
        let center = [
            0,
            0,
        ];
        circleData = circleData.concat(vert);
        circleData = circleData.concat(center);

        colorData.push(rgb[0], rgb[1], rgb[2]);
        colorData.push(1.0, 1.0, 1.0);

        if(rgb[0] > 0 && rgb[2] === 0.0){
            rgb[0] -= 1/120;
            rgb[1] += 1/120;
        } else if(rgb[1] > 0){
            rgb[1] -= 1/120;
            rgb[2] += 1/120;
        } else if(rgb[2] > 0){
            rgb[2] -= 1/120;
            rgb[0] += 1/120;
        }

        console.log(rgb);
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleData), gl.STATIC_DRAW);
    let a_position = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
    let a_color = gl.getAttribLocation(program, 'a_color');
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, circleData.length / 2);
}




function checkKeyDown(){
    $(document).keydown(function(e) {
        if(e.key == "ArrowUp"){
            makeMatrix(0.0, 0.02);
            circle();
        }

        if(e.key == "ArrowDown"){
            makeMatrix(0.0, -0.02);
            circle();
        }

        if(e.key == "ArrowLeft"){
            makeMatrix(-0.02, 0.0);
            circle();
        }

        if(e.key == "ArrowRight"){
            makeMatrix(0.02, 0.0);
            circle();
        }
    });
}