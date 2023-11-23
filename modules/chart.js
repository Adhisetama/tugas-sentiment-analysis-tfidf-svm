/**
 * DOCUMENTATION:
 * 
 * 
 * // 1.| deklarasi class
 * const chart = new Chart(e); // e -> html canvas element
 * 
 * // 2.| titik-titik datapoint disimpan dalam this.dataPoints : number[]
 * // modifikasi layaknya array biasa
 * p = [n1, n2, ..., nm]
 * chart.dataPoints = p
 * chart.dataPoints.push(n_new)
 * chart.dataPoints.shift()
 * 
 * // 3.| untuk  gambar chart berdasar this.dataPoints, gunakan this.drawChart(color)
 * // ini otomatis men clear isi chart sebelumnya
 * chart.drawChart("black")
 * 
 * // 4.| untuk clear chart
 * chart.clear()
 *  * 
 */

class Chart
{

    /**
     * 
     * @param {HTMLElement} canvasElement html element: <canvas>
     */
    constructor(canvasElement, padding=20) {
        this.canvas = canvasElement
        this.canvas.style.border = "1px solid black"
        this.canvas.setAttribute("width", `${this.canvas.offsetWidth}`)
        this.canvas.setAttribute("height", `${this.canvas.offsetHeight}`)
        this.padding = padding

        this.dataPoints = []

        this.ctx = this.canvas.getContext('2d')
    }

    drawChart(color="darkgray", withPoint=false) {

        if (this.dataPoints < 2) return

        // what the hell
        const drawPoint = withPoint
        ? (x, y) => this.ctx.fillRect(x-3, y-3, 7, 7)
        : () => {}

        // clear canvas
        this.clear()

        // get max & min X and Y
        // this.min_Y = this.dataPoints[0]
        // this.max_Y = this.dataPoints[0]
        this.min_Y = 0 // note: code di atas jika ingin Y dynamic
        this.max_Y = 1 //

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
            drawPoint(x_now, Y[i])
        }
        this.ctx.stroke()

    }


    convertToVirtualHeight(p) {
        return this.canvas.offsetHeight - ((p - this.min_Y) * ((this.canvas.offsetHeight - 2*this.padding) / this.len_Y) + this.padding)
    }


    clear() {
        this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    }

}