/**
 * an attemp to make simplistic library for drawing on canvas
 */

/**
 * TODO:
 * - rapikan
 * - buat sistem padding
 */

class Canvas
{
    /**
     * 
     * @param {HTMLElement} canvas element canvas pada HTML
     */
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.w = () => this.canvas.offsetWidth
        this.h = () => this.canvas.offsetHeight
        this.bjir = {}
    }

    
    draw(points, weight, bias) {
        this.segoGoreng(points)
        points.forEach(p  => {
            this.drawPoint(this.convertToCanvasCoordinate(p))
        })
        this.drawLine(this.getLineFromVector(weight, bias))
    }


    // subfungsi

    /**
     * point berformat [x, y, class]
     * dimana x, y sudah dalam pixel relatif ke canvas
     * class bernilai 1 atau -1
     * @param {number[3]} point 
     */
    drawPoint(point) {
        this.ctx.fillStyle = point[2] === 1 ? "blue" : "red"
        this.ctx.fillRect(point[0], point[1], 10, 10)
    }

    drawLine(FromTo) {
        if (FromTo.length == 0) return
        this.ctx.moveTo(...FromTo[0])
        this.ctx.lineTo(...FromTo[1])
        this.ctx.stroke()
    }

    
    /**
     * 
     * @param {number[][3]} points array dari point: array yg [x, y, class],
     *                      class dapat bernilai 1 atau -1
     * @returns 
     */
    segoGoreng(points) {
        let bjir = {
            min_X: points[0][0],
            max_X: points[0][0],
            min_Y: points[0][1],
            max_Y: points[0][1]
        }
        for (const p of points) {
            if (p[0] < bjir.min_X)
                bjir.min_X = p[0]
            if (p[0] > bjir.max_X)
                bjir.max_X = p[0]
            if (p[1] < bjir.min_Y)
                bjir.min_Y = p[1]
            if (p[1] > bjir.max_Y)
                bjir.max_Y = p[1]
        }
        this.bjir = bjir
        return bjir
    }

    /**
     * konversi koordinat asli dengan koordinat pixel relatif pada kanvas
     * 
     * @param {number[2]} point titik [x, y]
     * @returns {number[2]} titik [x, y] dalam pixel canvas
     */
    convertToCanvasCoordinate(point) {
        // canvas_coord = (original_coord - min_coord) * (canvas_coord_length / original_coord_length)
        return [
            (point[0] - this.bjir.min_X) * (this.w() / (this.bjir.max_X - this.bjir.min_X)),
            (point[1] - this.bjir.min_Y) * (this.h() / (this.bjir.max_Y - this.bjir.min_Y)),
            point[2]
        ]
    }

    /**
     * get array berisi 2 titik yg dilewati line, relatif dengan pixel kanvas
     * 
     * @param {number[2]} weight 
     * @param {number} bias 
     * @returns {number[][2] | []}
     */
    getLineFromVector(weight, bias) {
        // equation y = mx + c
        const m = -weight[0]/weight[1]
        const c = -bias/weight[1]
        const y = x => m*x + c
        const x = y => (y - c) / m

        // calculate from and to, cek semua titik kotak
        let FromTo = []
        
        // 1. apabila garis bertubrukan dengan sisi kanan:
        if (this.bjir.min_Y < y(this.bjir.max_X) < this.bjir.max_Y)
            FromTo.push([this.bjir.max_X, y(this.bjir.max_X)])

        // 2. apabila garis bertubrukan dengan sisi kiri:
        if (this.bjir.min_Y < y(this.bjir.min_X) < this.bjir.max_Y)
            FromTo.push([this.bjir.min_X, y(this.bjir.min_X)])

        // 3. apabila garis bertubrukan dengan sisi atas:
        if (this.bjir.min_X < x(this.bjir.max_Y) < this.bjir.max_X)
            FromTo.push([x(this.bjir.max_Y), this.bjir.max_Y])

        // 4. apabila garis bertubrukan dengan sisi bawah:
        if (this.bjir.min_X < x(this.bjir.min_Y) < this.bjir.max_X)
            FromTo.push([x(this.bjir.min_Y), this.bjir.min_Y])

        // kalo bener harusnya FromTo berisi 2 ato 0 elemen
        return FromTo.map(p => this.convertToCanvasCoordinate(p))
    }

}

/**
 * 
 * cara kerja:
 * 1. ambil kumpulan titik
 * 2. tentukan ukuran titik tertinggi/ter outlier
 *      how?
 *      -> tentukan value x dan y tertinggi dan terendah
 *      -> jadikan yg x terendah itu x:0, yg tertinggi itu this.h()
 *      -> jadikan yg y terendah itu y:0, yg tertinggi itu this.w()
 *      
 * fungsi yg akan dibuat:
 * 1. drawpoints:
 *  param: kumpulan titik" 2D
 *  output:
 *      - konversi koordinat dari kanvas ke sebenarnya (tau dari canvas length, original length, dan starting point)
 *      - titik 0,0
 * 
 */