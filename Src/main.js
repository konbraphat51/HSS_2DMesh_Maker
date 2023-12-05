StopAllTouchDefaults();

var edges = []
var flagClicking = false;

function CanvasToSystem(position) {
    return [
        position[0] - GetCanvasSize()[0] / 2,
        position[1] - GetCanvasSize()[1] / 2
    ]
}

function SystemToCanvas(position) {
    return [
        position[0] + GetCanvasSize()[0] / 2,
        position[1] + GetCanvasSize()[1] / 2
    ]
}

function Draw() {
    //reset canvas
    SetColor("white")
    DrawRect(0, 0, GetCanvasSize()[0], GetCanvasSize()[1])

    //draw edges
    SetColor("black")
    edges.forEach(edge => {
        DrawCircle(edge[0], edge[1], 5)
    });

    //draw polygon
    SetColor("#AFEEEE")
    DrawPolygon(edges)

    //grids
    //center
    SetColor("red")
    DrawCircleByVec(SystemToCanvas([0, 0]), 5)

}

function Control() {
    // if clicked...
    if (GetMouse() & !flagClicking) {
        flagClicking = true;
        AddEdge(GetMouseX(), GetMouseY())
    } else if (!GetMouse()) {
        flagClicking = false;
    }
}

function AddEdge(x, y) {
    edges.push([x, y])
}

async function main() {
    while (true) {
        Draw()
        Control()

        await Sleep(16)
    }
}