// TODO:
// buat code yg accept train parameter: 
//      X berisi xi:vektor
//      Y berisi yi:class
// return:
//      W:vektor
//      b:scalar
// dengan algoritma SVM

class SVM {

    /**
     * inisiasi SVM, (belum ada parameter checking).
     * 
     * @param {number[][]} X_train array berisi vektor x_i dgn dimensi sama
     * @param {number[]} Y_train array berisi class y_i (1 atau -1)
     * @param {Object} options
     * @param {number} options.C hyperparameter C 
     * @param {number} options.E hyperparameter epsilon (error tolerance)
     */
    constructor(X_train, Y_train, options={}) {
        // input parameter
        this.X = X_train // array berisi vektor x_i
        this.Y = Y_train // array berisi class  y_i
                
        // variabel untuk perhitungan SVM
        this.N = X.length
        this.alpha = Array(this.N)                           // parameter alpha di lagrange multiplier
        this.C = options.C !== undefined ? options.C : 10    // hyperparameter C. default=10
        this.E = options.E !== undefined ? options.E : 0.01  // hyperparameter epsilon (error tolerance). default=0.01

        // optimized value
        this.w = Array(this.N)
        this.b = 0
    }

    iterate() {
        // pick 2 random index
        [r, s]     = SVM.Math.pickTwo(this.N)

        // ======= nanti ini didalem loop

        // assign variable (biar ga dikit" thas this thas this)
        const [a_r, a_s] = [this.alpha[r], this.alpha[s]]
        const [x_r, x_s] = [this.X[r], this.X[s]]
        const [y_r, y_s] = [this.Y[r], this.Y[s]]


        // definisikan batas range untuk a_r
        const gamma = SVM.Calc.gamma(r, s)
        if (y_r === y_s) {
        // kasus 1. untuk y_r == y_s (titik x_r & x_s dalam class yg sama)
            range = [
                Math.max(0, -y_r*(y_s*this.C - gamma)),
                Math.min(this.C, y_r*gamma)
            ]
        } else {
        // kasus 2. untuk y_r != y_s (titik x_r & x_s dalam class yg berbeda)
            range = [
                Math.max(0, y_r*gamma),
                Math.min(this.C, -y_r*(y_s*this.C - gamma))
            ]
        }


        // cari parameter a,b,c dalam persamaan kuadrat f(a_r)
        // penjelasan:
        //      dari persamaan asli, ambil a_r & a_s sebagai variabel dan
        //      anggap lainnya konstanta, tapi substitusikan a_s = (gamma - a_r*y_r)/y_s
        //      dan didapetlah persamaan kuadrat yg variabelnya cuma a_r ¯\_(ツ)_/¯
        const a = 0.5*(SVM.Math.dot(x_r, x_r) + SVM.Math.dot(x_s, x_s) - 2*SVM.Math.dot(x_r, x_s))
        const b = gamma*y_r*(SVM.Math.dot(x_r, x_s) - SVM.Math.dot(x_s, x_s))
                + y_r*SVM.Math.dot(
                    this.X.reduce((acc, x_i, i) => {
                        if (i == r || i == s) return acc + Array(this.N).fill(0)
                        return SVM.Math.eachElements(acc, x_i, (acc_i, x_i_j, j) => this.alpha[j]*this.Y[j]*x_i_j)
                    }, Array(this.N).fill(0)),
                    SVM.Math.eachElements(x_r, x_s, (x_r_i, x_s_i, i) => x_r_i - x_s_i)
                )
                + y_r*y_s - 1
        const c = 

    }

    static Calc = {

        /**
         * gamma adalah sebuah variabel sebagai constraint sehingga
         * a_r*y_r + a_s*y_s = gamma
         * karena : sum(a_i, y_i) = 0,
         * maka   : a_r*y_r + a_s*y_s = -sum(a_i, y_i ; i not in {r, s})
         *          a_r*y_r + a_s*y_s = gamma --> dijadikan variabel
         * @param {number} r index
         * @param {number} s index
         * @returns {number} value gamma
         */
        gamma(r, s) {
            let accumulator = 0
            for (let i=0; i<SVM.N && i!==r && i!==s; i++) {
                accumulator += SVM.alpha[i] * SVM.y[i]
            }
            return -accumulator
        },

        lagrangianDualForm() {
            // TODO: buat ini
        }
    }

    static Math = {
        /**
         * dot product vektor
         * note: belum ada param checking di function ini
         * @param {number[]} x 
         * @param {number[]} y 
         * @returns {number[]} hasil dot product vektor x dan y
         */
        dot: (x, y) => x.reduce((acc, x_i, i) => acc += x_i * y[i], 0),

        /**
         * operasi per elemen vektor 
         * 
         * @param {number[]} x vektor x
         * @param {number[]} y vektor y
         * @param {Function} callback function yg menerima parameter x_i, y_i,
         *                   mereturn hasil operasi x_i dan y_i.
         *                   x_i, y_i elemen ke-i vektor x dan y
         * @returns {number[]} result
         */
        eachElements: (x, y, callback) => x.map((x_i, i) => callback(x_i, y[i], i)),

        /**
         * 
         * @param {number[]} x 
         * @returns jumlah dari array
         */
        sum: x => x.reduce((a, b) => a + b, 0),

        // nggatau bakal dipake apa ngga
        // /**
        //  * 
        //  * @param {number} from start index
        //  * @param {number} to end index
        //  * @param {Function} callback fungsi yg mereturn apa yg didalam sigma,
        //  *                   menerima parameter i=index saat itu
        //  */
        // sigma: (from, to, callback) => {
        //     let accumulator = 0
        //     while(from < to) {
        //         accumulator += callback(to++)
        //     }
        //     return accumulator
        // },

        /**
         * ambil 2 index unik random dari array dgn panjang n
         * @param {number} n panjang dari array
         * @returns {number[]} 2 index yg dipilih
         */
        pickTwo: n => {
            const r = [
                Math.floor(Math.random(n) * n),
                Math.floor(Math.random(n) * n)
            ]
            while(r[0] === r[1]) r[1] = Math.floor(Math.random(n) * n)
            return r
        }
    }

}

// const SVM_Math = {
//     /**
//      * dot product vektor
//      * note: belum ada param checking di function ini
//      * @param {number[]} x 
//      * @param {number[]} y 
//      * @returns {number[]} hasil dot product vektor x dan y
//      */
//     dot: (x, y) => x.map((x_i, i) => x_i * y[i]),

//     /**
//      * 
//      * @param {number[]} x 
//      * @returns jumlah dari array
//      */
//     sum: x => x.reduce((a, b) => a + b, 0),

//     /**
//      * ambil 2 index unik random dari array dgn panjang n
//      * @param {number} n panjang dari array
//      * @returns {number[]} 2 index yg dipilih
//      */
//     pickTwo: n => {
//         const r = [
//             Math.floor(Math.random(n) * n),
//             Math.floor(Math.random(n) * n)
//         ]
//         while(r[0] === r[1]) r[1] = Math.floor(Math.random(n) * n)
//         return r
//     }

// }