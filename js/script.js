class DrawerInterpreter {
    constructor(target) {
        this.canvas = document.getElementById(target);
        if (this.canvas && this.canvas.getContext) {
            this.ctx = this.canvas.getContext("2d");
            const dpi = window.devicePixelRatio;
            this.ctx.scale(dpi, dpi);
            this.updateArea();
        } else
            console.log("Failed to setup DrawerInterpreter on target: " + target.toString());
    }
    updateArea() {
        this.clear();
        let rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * devicePixelRatio;
        this.canvas.height = rect.height * devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.xScale = rect.width/100;
        this.yScale = rect.height/100;
        this.toRect();
    }

    toRect() {
        this.canvas.style.height = this.canvas.getBoundingClientRect().width + 'px';
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    line(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1*this.xScale, y1*this.yScale);
        this.ctx.lineTo(x2*this.xScale, y2*this.yScale);
        this.ctx.stroke();
    }

    lineTo({x, y}) {
        this.ctx.lineTo(x*this.xScale, y*this.yScale);
    }

    arcTo({x1, y1, x2, y2, radius}) {
        this.ctx.arcTo(x1*this.xScale, y1*this.yScale, x2*this.xScale, y2*this.yScale, radius*this.xScale);
    }

    fillCircle(x, y) {
        thic.ctx.fillCircle(1, 2)
    }

    shape(fillStyle, strokeStyle, x, y, ...line) {
        let prevFS = this.ctx.fillStyle;
        let prevSS = this.ctx.strokeStyle;

        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;

        this.ctx.beginPath();
        this.ctx.moveTo(x*this.xScale, y*this.yScale);

        for(let key in line) {
            let iter = line[key];
            switch (iter.type) {
                case "lineTo": this.lineTo(iter); break;
                case "arcTo": this.arcTo(iter); break;
            }
        }

        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = prevFS;
        this.ctx.strokeStyle = prevSS;
    }


    fillText(text, x, y, scale=1) {
        this.ctx.font = `${this.xScale*4*scale}px Roboto Slab`;
        this.ctx.fillText(text, x*this.xScale, y*this.yScale);
    }

}

class TableModifier {
    constructor(target, columns) {
        this.table = document.getElementById(target);
        this.header = this.table.innerHTML;
        if(!this.table)
            console.log("Failed to initialise table at target: "+target);
        this.columns = this.table.rows[0].cells.length;
    }

    addRow(...cols) {
        let row = document.createElement("tr");
        for(let i=0;i<cols.length&&i<this.columns;i++) {
            let col = document.createElement("td")
            col.appendChild(document.createTextNode(cols[i]));
            row.appendChild(col);
        }
        this.table.appendChild(row);
    }

    setContent(html) {
        this.table.innerHTML = this.header+html;
    }

    clear() {
        this.table.innerHTML = this.header;
    }
}

function get_request(link, event) {
    let xhr = new XMLHttpRequest();
    xhr.onloadend = () => event(xhr.response);
    xhr.open("GET", link);
    xhr.send();
}
window.onload = function (e) {
    console.log("Window loaded");

    const di = new DrawerInterpreter("graph");
    const tm = new TableModifier("history", 4);
    const form =  document.getElementById("request_form");

    const gather = () => {
        let formData = new FormData(form);
        return {
            X: formData.get("x"),
            Y: formData.get("y").replace(",","."),
            R: formData.get("r")
        }
    }

    const draw = () => {
        let data = gather();

        di.updateArea();
        di.ctx.lineWidth = 3;
        di.shape("#d4bfd0", "#702963",
            50,50,
            {type: "lineTo", x: 50, y: 70},
            {type: "lineTo", x: 10, y: 70},
            {type: "lineTo", x: 10, y: 50},
            {type: "arcTo", x1: 10, y1: 10, x2: 50, y2: 10, radius: 40},
            {type: "lineTo", x: 50, y: 30},
            {type: "lineTo", x: 70, y: 50},
            {type: "lineTo", x: 50, y: 50});

        di.ctx.lineWidth = 1;

        di.line(0, 50, 100, 50); // Ox
        di.line(50, 0, 50, 100); // Oy

        di.line(10, 48.5, 10, 51.5); // | -R
        di.fillText(`-${data.R}`, 11, 48.5, 0.8);

        di.line(30, 48.5, 30, 51.5); // | -R/2
        di.fillText(`-${data.R/2}`, 31, 48.5, 0.8);

        di.line(90, 48.5, 90, 51.5); // | R
        di.fillText(`${data.R}`, 91, 48.5, 0.8);

        di.line(70, 48.5, 70, 51.5); // | R/2
        di.fillText(`${data.R/2}`, 71, 48.5, 0.8);

        di.line(48.5, 10,51.5, 10); // - R
        di.fillText(`${data.R}`, 52, 11, 0.8);

        di.line(48.5, 30,51.5, 30); // - R/2
        di.fillText(`${data.R/2}`, 52, 31, 0.8);

        di.line(48.5, 70,51.5, 70); // - -R/2
        di.fillText(`-${data.R/2}`, 52, 71, 0.8);


        di.line(48.5, 90,51.5, 90); // - -R
        di.fillText(`-${data.R}`, 52, 91, 0.8);

        di.line(48.5, 3, 50, 0);  // /\
        di.line(51.5, 3, 50, 0);  // ||
        di.fillText("y", 45, 4);

        di.line(97, 51.5, 100, 50);
        di.line(97, 48.5, 100, 50); // ->
        di.fillText("x", 95, 47);

    }


    const submit = () => {
        const {X: x, Y: y, R: r} = gather();

        if(!y||isNaN(y)||y<-3||y>5) {
            document.getElementById("y_label").style.color = "red";
            return;
        }
        document.getElementById("y_label").style.color = "black";
        get_request( "handlers/form.php"+`?x=${x}&y=${y}&r=${r}`, (html) => {
            tm.setContent(html)
        });
    }

    get_request("handlers/start.php", (html) => tm.setContent(html));
    draw();

    window.addEventListener("resize", draw);
    form.addEventListener("change", draw);
    document.getElementById("send_request").onclick = submit;
    document.getElementById("clear_request").onclick = () => {
        get_request("handlers/clear.php");
        tm.clear();
    }


    let r_toggles = document.getElementsByClassName("r_toggle");
    for(let iter of r_toggles) {
        iter.onclick = () => {
            for(let iter of r_toggles)
                iter.classList.remove("active");
            iter.classList.add("active");
            document.getElementById("r_input").setAttribute("value", iter.getAttribute("value"));
            draw();
        }
    }
}


