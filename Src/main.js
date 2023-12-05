StopAllTouchDefaults();

var edges = []
var flagClicking = false;
var flagDeleting = false;

var grids_x = []
var grids_y = []

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

    //center point
    SetColor("red")
    DrawCircleByVec(SystemToCanvas([0, 0]), 5)

    //grid
    if (GetCheckBoxValue("showingGrid", true)) {
        ShowGrids()
    }

    // show mouse position
    SetColor("black")
    SetFont("20px Arial")
    mouse_system_position = CanvasToSystem([GetMouseX(), GetMouseY()])
    DrawText("Mouse: " + mouse_system_position[0] + ", " + mouse_system_position[1], 50, 50)
}

function ShowGrids() {
    let grid_interval = 10

    let x_n = GetCanvasSize()[0] / grid_interval + 1
    let y_n = GetCanvasSize()[1] / grid_interval + 1

    SetColor("gray")

    grids_x = []
    for (let cnt = -Math.floor(x_n / 2); cnt < Math.floor(x_n / 2); cnt++) {
        let x = grid_interval * cnt
        grids_x.push(x)

        let canvas_x = SystemToCanvas([x, 0])[0]

        DrawLine(canvas_x, 0, canvas_x, GetCanvasSize()[1])
    }

    grids_y = []
    for (let cnt = -Math.floor(y_n / 2); cnt < Math.floor(y_n / 2); cnt++) {
        let y = grid_interval * cnt
        grids_y.push(y)

        let canvas_y = SystemToCanvas([0, y])[1]

        DrawLine(0, canvas_y, GetCanvasSize()[0], canvas_y)
    }
}

function Control() {
    // if clicked...
    if (GetMouse() & !flagClicking) {
        flagClicking = true;

        if (GetCheckBoxValue("showingGrid", true)) {
            let positionPutting = SystemToCanvas(FindNearestGrid(CanvasToSystem([GetMouseX(), GetMouseY()])))
            AddEdge(positionPutting[0], positionPutting[1])
        } else {
            AddEdge(GetMouseX(), GetMouseY())
        }
    } else if (!GetMouse()) {
        flagClicking = false;
    }

    // if "d" key is pressed...
    if (GetKey("KeyD") & !flagDeleting) {
        flagDeleting = true;

        let nearest_edge = FindNearestEdgeIndex([GetMouseX(), GetMouseY()])
        edges.splice(nearest_edge, 1)
    } else if (!GetKey("KeyD")) {
        flagDeleting = false;
    }
}

function FindNearestGrid(positionSystem) {
    let nearest_x = grids_x[0]
    let nearest_y = grids_y[0]

    grids_x.forEach(x => {
        if (Math.abs(x - positionSystem[0]) < Math.abs(nearest_x - positionSystem[0])) {
            nearest_x = x
        }
    })

    grids_y.forEach(y => {
        if (Math.abs(y - positionSystem[1]) < Math.abs(nearest_y - positionSystem[1])) {
            nearest_y = y
        }
    })

    return [nearest_x, nearest_y]
}

function FindNearestEdgeIndex(positionCanvas) {
    let nearest_edge_index = 0

    edges.forEach((edge, index) => {
        if (GetDistance(edge, positionCanvas) < GetDistance(edges[nearest_edge_index], positionCanvas)) {
            nearest_edge_index = index
        }
    })

    return nearest_edge_index
}

function AddEdge(x, y) {
    edges.push([x, y])
}

async function main() {
    PutCheckBox("showingGrid", "Show Grid", false)

    while (true) {
        Draw()
        Control()

        await Sleep(16)
    }
}