let gl;
let program;
let vertexBuffer;
let indexBuffer;
let textureCoordsBuffer;
let colorBuffer;

let move_x = 0.0;
let move_z = -5.0;

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
        tetrahedron();
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
    let a_textCoords = gl.getAttribLocation(program, 'a_textCoords');
    let a_color = gl.getAttribLocation(program, "a_color");
    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_textCoords);
    gl.enableVertexAttribArray(a_color);
    gl.enable(gl.DEPTH_TEST);

    makeMatrixs(0.0, 0.0);
}


function  makeMatrixs(dx, dz){
    move_x += dx;
    move_z += dz;

    let mvMatrix = mat4.create();
    let pMatrix = mat4.create();
    mat4.perspective(pMatrix, 1.04, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.translate(mvMatrix,mvMatrix,[move_x, 0, move_z]);
    mat4.rotate(mvMatrix,mvMatrix, -1.3, [1.0, 0.0, 0.0]); //rotateX
    mat4.rotate(mvMatrix,mvMatrix, 0.0, [0.0, 1.0, 0.0]); //rotateY
    mat4.rotate(mvMatrix,mvMatrix, 0.7, [0.0, 0.0, 1.0]); //rotateZ


    let u_mvMatrix = gl.getUniformLocation(program, "u_mvMatrix");
    let u_pMatrix = gl.getUniformLocation(program, "u_pMatrix");
    gl.uniformMatrix4fv(u_pMatrix,false, pMatrix);
    gl.uniformMatrix4fv(u_mvMatrix, false, mvMatrix);
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

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    textureCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
}


function clear(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}


function tetrahedron(){
    clear();

    let tetrahedronData = [
        //x     y      z         R      G      B
        0.0,   0.0,   1.0,      1.0,   0.0,   0.0,
        0.94,  0.0,  -0.33,     0.0,   1.0,   0.0,
        -0.47,  0.81, -0.33,     0.0,   0.0,   1.0,
        -0.47, -0.81, -0.33,     1.0,   1.0,   1.0,
    ];

    let tetrahedronIndexes = [
        0, 1, 2,
        0, 1, 3,
        0, 2, 3,
        1, 2, 3
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tetrahedronData), gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tetrahedronIndexes), gl.STATIC_DRAW);

    let a_position = gl.getAttribLocation(program, 'a_position');
    let a_color = gl.getAttribLocation(program, 'a_color');
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

    gl.drawElements(gl.TRIANGLES, tetrahedronIndexes.length, gl.UNSIGNED_SHORT, 0);
}




function checkKeyDown(){
    $(document).keydown(function(e) {
        if(e.key == "ArrowUp"){
            makeMatrixs(0.0, -0.09);
            tetrahedron();
        }

        if(e.key == "ArrowDown"){
            makeMatrixs(0.0, 0.08);
            tetrahedron();
        }

        if(e.key == "ArrowLeft"){
            makeMatrixs(-0.03, 0.0);
            tetrahedron();
        }

        if(e.key == "ArrowRight"){
            makeMatrixs(0.03, 0.0);
            tetrahedron();
        }
    });
}


