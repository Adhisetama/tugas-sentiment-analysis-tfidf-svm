/**
 * DOCUMENTATION:
 * 
 * 
 * // 1.| deklarasi class
 * const canvas = new Canvas(e); // e -> html canvas element
 * 
 * // 2.| untuk gambar titik:
 * p = [n1, n2, ..., nm]
 * 
 * canvas.drawPoints(colors)
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
     */
    constructor(canvasElement, padding) {
        this.canvas = canvasElement
        this.canvas.style.border = "1px solid black"
        this.canvas.setAttribute("width", `${this.canvas.offsetWidth}`)
        this.canvas.setAttribute("height", `${this.canvas.offsetHeight}`)
        this.padding = padding

        this.dataPoints = []

        this.ctx = this.canvas.getContext('2d')
    }

    drawPoints(color="darkgray") {

        // clear canvas
        this.clear()

        // get max & min X and Y
        this.min_Y = this.dataPoints[0]
        this.max_Y = this.dataPoints[0]

        for (const p of this.dataPoints) {
            if (p < this.min_Y)
                this.min_Y = p
            if (p > this.max_Y)
                this.max_Y = p
        }
        
        this.len_Y = this.max_Y - this.min_Y

        // convert all this.dataPoints height to relative to canvas
        const Y = this.dataPoints.map(p => this.convertToVirtualHeight(p))

        // create gap within points
        const gap_x = this.canvas.offsetWidth / (Y.length - 1)
        let x_now = 0

        // begin
        this.ctx.beginPath()
        this.ctx.strokeStyle = color
        this.ctx.fillStyle = color
        this.ctx.moveTo(x_now, Y[0])
        for (let i = 1; i < Y.length; i++) {
            x_now += gap_x
            this.ctx.lineTo(x_now, Y[i])
        }
        this.stroke()

    }


    convertToVirtualHeight(p) {
        return this.canvas.offsetHeight - ((p - this.min_Y) * ((this.canvas.offsetHeight - 2*this.padding) / this.len_Y) + this.padding)
    }


    clear() {
        this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    }

}