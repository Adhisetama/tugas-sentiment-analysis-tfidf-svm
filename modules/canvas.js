/**
 * DOCUMENTATION:
 * 
 * 
 * // 1.| deklarasi class
 * const canvas = new Canvas(e, options); // e -> html canvas element, 
 *                                        // options -> object, property: height, width, padding
 *                                        // parameter 'options' optional, ada default value nya
 * 
 * // 2.| untuk gambar titik:
 * p = [[p1x, p1y], [p2x, p2y], ... [pnx, pny]]
 * colors = ["color1", "color2", ... "colorn"]
 * canvas.drawPoints(p, colors)
 * 
 * 
 * // 3.| untuk  gambar garis:
 * canvas.drawLine(w, b) // garis direpresentasikan dengan weight vektor w dan bias b
 * 
 * // 4.| untuk gambar axis:
 * canvas.drawAxis()
 * 
 * // note: untuk 3. & 4.:
 *      - sebelumnya harus .drawPoints() dulu untuk tentuin skala konversi koordinat
 *      - jika garisnya diluar scope canvas, ngga akan kegambar
 * 
 * // 5.| untuk clear canvas
 * canvas.clear()
 * 
 * // note: canvas ini hanya support vektor 2d. parameter p di .drawPoints() dan w di .drawLine() harus 2 dimensi
 * 
 */

class Canvas
{

    /**
     * 
     * @param {HTMLElement} canvasElement html element: <canvas>
     * @param {Object} options 
     * @param {number} options.width panjang dari canvas
     * @param {number} options.height tinggi dari canvas
     * @param {number} options.padding padding dari canvas
     */
    constructor(canvasElement, options={}) {
        this.canvas = canvasElement
        this.canvas.style.border = "1px solid black"
        this.canvas.style.width = options.width !== undefined ? options.width + "px" : "500px"
        this.canvas.style.height = options.height !== undefined ? options.height + "px" : "500px"
        this.canvas.setAttribute("width", options.width !== undefined ? options.width + "px" : "500px")
        this.canvas.setAttribute("height", options.height !== undefined ? options.height + "px" : "500px")
        this.padding = options.padding ? options.padding : 20

        this.ctx = this.canvas.getContext('2d')
    }

    drawPoints(points, colors) {

        // get max & min X and Y
        this.min_X = points[0][0]
        this.max_X = points[0][0]
        this.min_Y = points[0][1]
        this.max_Y = points[0][1]

        for (const p of points) {
            if (p[0] < this.min_X)
                this.min_X = p[0]
            if (p[0] > this.max_X)
                this.max_X = p[0]
            if (p[1] < this.min_Y)
                this.min_Y = p[1]
            if (p[1] > this.max_Y)
                this.max_Y = p[1]
        }
        
        this.len_X = this.max_X - this.min_X
        this.len_Y = this.max_Y - this.min_Y

        points
            .map(p => this.convertToVirtualCoordinate(p))
            .forEach((p, i) => {
                if (colors[i] !== undefined) {
                    this.ctx.fillStyle = colors[i]
                } else {
                    this.ctx.fillStyle = "darkgray"
                }
                this.ctx.fillRect(p[0], p[1], 10, 10)
            })


    }

    getVirtualWidth() {
        return this.canvas.offsetWidth - 2*this.padding
    }

    getVirtualHeight() {
        return this.canvas.offsetHeight - 2*this.padding
    }

    convertToVirtualCoordinate(p) {
        // virtual_coord = original_coord - min_original_coord * virtual_length / original_coord_length + padding
        return [
            (p[0] - this.min_X) * (this.getVirtualWidth() / this.len_X) + this.padding,
            // untuk y, maka y <-- canvas_height - y
            this.canvas.offsetHeight - ((p[1] - this.min_Y) * (this.getVirtualHeight() / this.len_Y) + this.padding)
        ]

    }

    drawLine(w, b) {
        const FromTo = this.convertVectorToLine(w, b)
        if (FromTo.length === 0) return
        this.ctx.beginPath()
        this.ctx.strokeStyle = "black"
        this.ctx.fillStyle = "black"
        this.ctx.moveTo(...FromTo[0])
        this.ctx.lineTo(...FromTo[1])
        this.ctx.stroke()
    }

    /**
     * fungsi ini menerjemahkan garis yang awalnya barbentuk vektor w dan bias b
     * menjadi dua titik koordinat"from" dan "to" dalam kanvas
     * @param {number[]} w weight atau vektor dari garis
     * @param {number} b bias dari garis
     * @returns 
     */
    convertVectorToLine(w, b) {
        // cek w
        if (w.some(e => e === undefined) || w[1] === 0) return []

        // equation y = mx + c
        const m = -w[0]/w[1]
        const c = -b/w[1]
        const line_y = x => m*x + c
        const line_x = y => (y - c) / m

        // calculate from and to, cek semua titik kotak
        let FromTo = []
        
        // 1. apabila garis bertubrukan dengan sisi kanan:
        if (this.min_Y < line_y(this.max_X) < this.max_Y)
            FromTo.push([this.max_X, line_y(this.max_X)])

        // 2. apabila garis bertubrukan dengan sisi kiri:
        if (this.min_Y < line_y(this.min_X) < this.max_Y)
            FromTo.push([this.min_X, line_y(this.min_X)])

        // 3. apabila garis bertubrukan dengan sisi atas:
        if (this.min_X < line_x(this.max_Y) < this.max_X)
            FromTo.push([line_x(this.max_Y), this.max_Y])

        // 4. apabila garis bertubrukan dengan sisi bawah:
        if (this.min_X < line_x(this.min_Y) < this.max_X)
            FromTo.push([line_x(this.min_Y), this.min_Y])

        // kalo bener harusnya FromTo berisi 2 ato 0 elemen
        return FromTo.map(p => this.convertToVirtualCoordinate(p))
    }

    drawAxis() {
        // check if 0,0 / axis line inside canvas
        const O = this.convertToVirtualCoordinate([0,0])
        this.ctx.strokeStyle = "gray"
        this.ctx.fillStyle = "gray"
        if (this.padding < O[0] < this.getVirtualWidth()) {
            this.ctx.beginPath()
            this.ctx.moveTo(O[0], this.getVirtualHeight() + 2*this.padding)
            this.ctx.lineTo(O[0], 0)
            this.ctx.stroke()
        }
        if (this.padding < O[1] < this.getVirtualHeight()) {
            this.ctx.beginPath()
            this.ctx.moveTo(0, O[1])
            this.ctx.lineTo(this.getVirtualWidth() + 2*this.padding, O[1])
            this.ctx.stroke()
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    }

}