function scrivnr() {
    var canvas = new fabric.Canvas("scrivnr", {
        width: ($("#scrivnr").parent()).width(),
        height: ($("#scrivnr").parent()).height(),
        backgroundColor: "#fff",
        selectionColor: "blue",
        selectionLineWidth: 2
    });
    var rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 20,
      height: 20
    });
    canvas.add(rect);
}
