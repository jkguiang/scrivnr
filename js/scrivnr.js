var type = "none";
var cursor_type = "default";

function scrivnr() {
    $("[id*=-btn]").css("outline", "none");
    // Drag and Draw
    var click = {"down":false,"x1":0, "x2":0, "y1":0, "y2":0};
    var canvas = new fabric.Canvas("scrivnr", {
        width: ($("#scrivnr").parent()).width(),
        height: ($("#scrivnr").parent()).height(),
        backgroundColor: "#fff",
        selectionLineWidth: 2
    });
    var obj_count = 0;
    // Handle mouse events on canvas
    canvas.on("mouse:down", function(evt) {
        if (type == "none") {
            return;
        }
        if (evt.target != null) {
            type = "none";
            return;
        }
        obj_count = (canvas.getObjects()).length;
        click.x1 = evt.pointer.x;
        click.y1 = evt.pointer.y;
        click.down = true;
    });
    canvas.on("mouse:move", function(evt) {
        canvas.setCursor(cursor_type);
        if (type == "none" || !click.down) {
            return;
        }
        click.x2 = evt.pointer.x;
        click.y2 = evt.pointer.y;
        drawShape(canvas, type, obj_count, getDims(click), "move");
    });
    canvas.on("mouse:up", function(evt) {
        if (type == "none") {
            return;
        }
        cursor_type = "default";
        canvas.setCursor(cursor_type);
        click.x2 = evt.pointer.x;
        click.y2 = evt.pointer.y;
        type = drawShape(canvas, type, obj_count, getDims(click), "up");
        click.down = false;
        $("[id*=-btn]").css("color", "");
    });
    // Handle mouse events off canvas
    $(window).on("mousedown", function(evt) {
        var html = (evt.target).outerHTML;
        if ((html.split("body")).length > 1) {
            type = "none"
            canvas.isDrawingMode = false;
            $("[id*=-btn]").css("color", "");
            cursor_type = "default";
            canvas.setCursor(cursor_type);
        }
    });
    // Toolbar Functions
    $("[id*=-btn]").click(function() {
        canvas.isDrawingMode = false;
        $("[id*=-btn]").css("color", "");
        $(this).css("color", "#337AB7");
    });
    // Draw
    $("#draw-btn").click(function() {
        canvas.isDrawingMode = true;
    });
    $("#draw-size").on("input", function() {
        var brush_size = $(this).val();
        canvas.freeDrawingBrush.width = brush_size;
    });
    // Shapes
    $("[id^=shapes-]").click(function() {
        type = $(this).attr("name");
        cursor_type = "crosshair";
        canvas.setCursor(cursor_type);
    });
    // Lines
    $("[id^=lines-]").click(function() {
        type = $(this).attr("name");
        cursor_type = "crosshair";
        canvas.setCursor(cursor_type);
    });
    // Textbox
    $("#textbox-btn").click(function() {
        type = "text";
        cursor_type = "crosshair";
        canvas.setCursor(cursor_type);
    });

}

function getDims(click) {
    var width = Math.abs(click["x1"] - click["x2"]);
    var height = Math.abs(click["y1"] - click["y2"]);
    if (width*height == 0) {
        width = 20;
        height = 20;
    }
    var dims = { "width": width,
                 "height": height,
                 "top": (click["y1"] < click["y2"]) ? click["y1"] : click["y2"],
                 "left": (click["x1"] < click["x2"]) ? click["x1"] : click["x2"],
                 "coords": [click.x1, click.y1, click.x2, click.y2]
               };
    return dims;
}

function drawShape(canvas, type, obj_count, dims, mouse_evt) {
    var shape;
    var coords = dims.coords;
    if (type == "rect") {
        shape = new fabric.Rect({
            fill: 'white',
            strokeWidth: 5, 
            stroke: 'black',
            left: dims.left,
            top: dims.top,
            width: dims.width,
            height: dims.height
        });
    }
    else if (type == "ellp") {
        shape  = new fabric.Ellipse({
            fill: 'white',
            strokeWidth: 5, 
            stroke: 'black',
            left: dims.left,
            top: dims.top,
            originX: 'left', 
            originY: 'top',
            rx: dims.width/2,
            ry: dims.height/2
        });
    }
    else if (type == "trng") {
        shape = new fabric.Triangle({
            fill: 'white',
            strokeWidth: 5, 
            stroke: 'black',
            left: dims.left,
            top: dims.top,
            width: dims.width,
            height: dims.height
        });
    }
    else if (type == "narr") {
        shape = new fabric.Line(coords, {
            fill: 'black',
            strokeWidth: 5, 
            stroke: 'black',
            originX: 'center', 
            originY: 'center'
        });
    }
    else if (type == "rarr") {
        var angle = (Math.atan((dims.coords[1]-dims.coords[3])/(dims.coords[0]-dims.coords[2])))*(180/Math.PI);
        var correction = (angle < 0) ? 90*(dims.coords[1]-dims.coords[3])/dims.height : -90*(dims.coords[0]-dims.coords[2])/dims.width;
        if (Math.abs(angle) <= 1) {
            correction = 0;
            angle = (dims.coords[0] < dims.coords[2]) ? 90 : -90;
        }
        else if (Math.abs(angle) >= 89) {
            correction = 0;
            angle = (dims.coords[1] < dims.coords[3]) ? 180 : 0;
        }
        var line = new fabric.Line(coords, {
            fill: 'black',
            strokeWidth: 5, 
            stroke: 'black',
            originX: 'center', 
            originY: 'center'
        });
        var triangle = new fabric.Triangle({
            fill: 'black',
            strokeWidth: 5, 
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            left: dims.coords[2],
            top: dims.coords[3],
            width: 10,
            height: 15,
            angle: angle + correction 
        });
        shape = new fabric.Group([ line, triangle ]);
    }
    else if (type == "larr") {
        var angle = (Math.atan((dims.coords[1]-dims.coords[3])/(dims.coords[0]-dims.coords[2])))*(180/Math.PI);
        var correction = (angle < 0) ? -90*(dims.coords[1]-dims.coords[3])/dims.height : 90*(dims.coords[0]-dims.coords[2])/dims.width;
        if (Math.abs(angle) <= 1) {
            correction = 0;
            angle = (dims.coords[0] < dims.coords[2]) ? -90 : 90;
        }
        else if (Math.abs(angle) >= 89) {
            correction = 0;
            angle = (dims.coords[1] < dims.coords[3]) ? 0 : 180;
        }
        var line = new fabric.Line(coords, {
            fill: 'black',
            strokeWidth: 5, 
            stroke: 'black',
            originX: 'center', 
            originY: 'center'
        });
        var triangle = new fabric.Triangle({
            fill: 'black',
            strokeWidth: 5, 
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            left: dims.coords[0],
            top: dims.coords[1],
            width: 10,
            height: 15,
            angle: angle + correction 
        });
        shape = new fabric.Group([ line, triangle ]);
    }
    else if (type == "barr") {
        var angle = (Math.atan((dims.coords[1]-dims.coords[3])/(dims.coords[0]-dims.coords[2])))*(180/Math.PI);
        var correction = (angle < 0) ? 90*(dims.coords[1]-dims.coords[3])/dims.height : -90*(dims.coords[0]-dims.coords[2])/dims.width;
        if (Math.abs(angle) <= 1) {
            correction = 0;
            angle = (dims.coords[0] < dims.coords[2]) ? 90 : -90;
        }
        else if (Math.abs(angle) >= 89) {
            correction = 0;
            angle = (dims.coords[1] < dims.coords[3]) ? 180 : 0;
        }
        var line = new fabric.Line(coords, {
            fill: 'black',
            strokeWidth: 5, 
            stroke: 'black',
            originX: 'center', 
            originY: 'center'
        });
        var triangle1 = new fabric.Triangle({
            fill: 'black',
            strokeWidth: 5, 
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            left: dims.coords[2],
            top: dims.coords[3],
            width: 10,
            height: 15,
            angle: angle + correction 
        });
        var triangle2 = new fabric.Triangle({
            fill: 'black',
            strokeWidth: 5, 
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            left: dims.coords[0],
            top: dims.coords[1],
            width: 10,
            height: 15,
            angle: (correction == 0) ? angle + 180 : angle - correction 
        });
        shape = new fabric.Group([ line, triangle1, triangle2 ]);
    }
    else if (type == "text") {
        var shape = new fabric.Textbox('Enter text here...', {
            fill: 'black',
            fontSize: 18,
            left: dims.left,
            top: dims.top,
            width: dims.width,
            height: dims.height
        });
    }
    else {
        return "none";
    }
    var objects = canvas.getObjects();
    if (objects.length > obj_count) {
        canvas.remove(objects[obj_count]);
    }
    (mouse_evt == "up") ? canvas.setActiveObject(null) : canvas.setActiveObject(shape);
    canvas.selection = (mouse_evt == "up");
    canvas.add(shape);
    return "none";
}

function setShape(new_type) {
    type = new_type;
    return;
}
