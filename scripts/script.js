let gl;
let program;
let vertexBuffer;
let indexBuffer;
let textureCoordsBuffer;
let colorBuffer;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();

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



    mat4.perspective(pMatrix, 1.04, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix,mvMatrix,[0, 0, -4]);
    mat4.rotate(mvMatrix,mvMatrix, 1.0, [0.9, 0.8, 0.2]);

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
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}


function setTexture(){
    let image = new Image();
    image.src = "texture4.jpg";

    let texture = gl.createTexture();
    let u_sampler = gl.getUniformLocation(program, "u_sampler");
    gl.uniform1i(u_sampler, 0);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.generateMipmap(gl.TEXTURE_2D);

    gl.activeTexture(gl.TEXTURE0);
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




function box(){
    clear();

    let boxData = [
        //перед
        -1.0,   1.0,   -1.0,
        1.0,  1.0,  -1.0,
        -1.0,  -1.0, -1.0,
        1.0, -1.0, -1.0,

        //задняя
        -1.0,   1.0,   1.0,
        1.0,  1.0,  1.0,
        -1.0,  -1.0, 1.0,
        1.0, -1.0, 1.0,

        //верх
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,


        //низ
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,


        //лево
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,


        //право
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,

    ];

    let boxIndexes = [
        //передняя
        0, 1, 2,
        1, 2, 3,

        //задняя
        4, 5, 6,
        5, 6, 7,

        //верх
        8, 9, 10,
        9, 10, 11,

        //низ
        12, 13, 14,
        13, 14, 15,

        //лево
        16, 17, 18,
        17, 18, 19,

        //право
        20, 21, 22,
        21, 22, 23,
    ];

    // Координаты текстуры
    let textureCoords = [
        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,
    ];



    let colorData = [
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        //задняя
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,

        //верх
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,


        //низ
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,


        //лево
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,


        //право
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
    ];

    setTexture();

    let a_position = gl.getAttribLocation(program, 'a_position');
    let a_textCoords = gl.getAttribLocation(program, 'a_textCoords');
    let a_color = gl.getAttribLocation(program, 'a_color');

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false,  0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndexes), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_textCoords, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 0, 0);

    gl.drawElements(gl.TRIANGLES, boxIndexes.length, gl.UNSIGNED_SHORT, 0);

}


function checkKeyDown(){
    $(document).keydown(function(e) {
        if(e.key == "ArrowUp"){
            box();
        }
    });
}


window.onload = function(){
    let canvas = document.getElementById("canvas3D");
    try {
        gl = canvas.getContext("webgl2");
    }
    catch(e) {}
      if (!gl) {
        alert("Ваш браузер не поддерживает WebGL");
    }

    if(gl){
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        initShaders();
        initBuffers();

        box();

        checkKeyDown();
    }
}


