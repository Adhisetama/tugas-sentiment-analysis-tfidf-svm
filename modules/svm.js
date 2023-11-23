// TODO:
// buat code yg accept train parameter: 
//      X berisi xi:vektor
//      Y berisi yi:class
// return:
//      W:vektor
//      b:scalar
// dengan algoritma SVM

/**
 * DOCUMENTATION
 * 
 * // 1.| inisialisasi class
 * const svm = new SVM(x_train, y_train)
 * 
 * // 2.| iterasi optimisasi (lakukan berulang")
 * svm.iterate()
 * 
 * // 3.| hitung weight & bias
 * let w = svm.getWeight()
 * let b = svm.getBias()
 * 
 */

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
        this.N = this.X.length       // banyak data training
        this.P = this.X[0].length    // banyak fitur/dimensi data
        this.alpha = Array(this.N).fill(0)                   // parameter alpha di lagrange multiplier
        this.C = options.C !== undefined ? options.C : 10    // hyperparameter C. default=10
        this.E = options.E !== undefined ? options.E : 0.01  // hyperparameter epsilon (error tolerance). default=0.01

        // optimized value
        this.w = Array(this.N).fill(0)
        this.b = 0
    }

    /**
     * memprediksi class Y berdasar feature vector X yang diberi dgn w dan b
     * @param {number[]} X_test vektor X untuk test. dimensi harus sama dengan dataset
     * @returns {1|-1} prediksi class (1 atau -1)
     */
    predict(X_test) {
        // decision function: sign of (w . x + b)
        return this.Math.dot(X_test, this.w) + this.b > 0 ? 1 : -1
    }

    /**
     * satu kali iterasi optimisasi SMO (sequential minimal optimization)
     * akan mengupdate 2 value alpha yg dipilih secara random
     * @returns {Object} detail dari iterasi (r,s yang dipilih; update a_r & a_s)
     */
    iterate() {
        // pick 2 random index
        let [r, s] = this.Math.pickTwo(this.N)

        // assign variable (biar ga dikit" thas this thas this)
        const [a_r, a_s] = [this.alpha[r], this.alpha[s]]
        const [x_r, x_s] = [this.X[r], this.X[s]]
        const [y_r, y_s] = [this.Y[r], this.Y[s]]

        // definisikan batas range untuk a_r
        let range = null
        const gamma = this.calcGamma(r, s)
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
        const beta = this.calcBeta(r, s)
        const a = 0.5*(this.Math.dot(x_r, x_r) + this.Math.dot(x_s, x_s) - 2*this.Math.dot(x_r, x_s))
        const b = gamma*y_r*(this.Math.dot(x_r, x_s) - this.Math.dot(x_s, x_s))
                + y_r*this.Math.dot(
                    this.Math.eachElements(x_r, x_s, (x_r_i, x_s_i, i) => x_r_i - x_s_i),
                    beta
                    )
                + y_r*y_s - 1
        const c = gamma*(
                    0.5*gamma*this.Math.dot(x_s, x_s)
                    + this.Math.dot(x_s, beta)
                    - y_s
                    )
        // ^^ semoga code nya gaada yg salah plis

        // x di kondisi critical: f'(x) = ax+b = 0
        // x = -b/2a
        let a_r_new = -b / (2*a)

        // batasi value x_r_new di range yg telah terdefinisi
        a_r_new = Math.min(Math.max(a_r_new, range[0]), range[1])

        // inget constraint a_r*y_r + a_s*y_s = gamma
        let a_s_new = (gamma - a_r_new*y_r) /  y_s

        // update value di svm
        this.alpha[r] = a_r_new
        this.alpha[s] = a_s_new

        // return info dari iterasi (untuk debug)
        return {
            "r": r,
            "s": s,
            "a_r_old": a_r,
            "a_r_new": a_r_new,
            "a_s_old": a_s,
            "a_s_new": a_s_new,
        }
        
    }

    /**
     * confusion matrix:
     *            predicted:
     *              +    -
     * actual: +  [[TP, FN],
     *         -   [FP, TN]]
     * @param {number[][]} X_test array of vectors
     * @param {number[]} Y_test array of class of vectors
     * @returns {number[2][2]} confusion matrix
     */
    getConfusionMatrix(X_test, Y_test) {
        const Y_pred = X_test.map(X => this.predict(X))
        const confusionMatrix = [[0,0],[0,0]]
        Y_pred.forEach((y_i, i) => {
            if (y_i == Y_test[i]) {
                if (y_i == 1) confusionMatrix[0][0]++ // true positive
                else          confusionMatrix[1][1]++ // true negative
            } else {
                if (y_i == 1) confusionMatrix[1][0]++ // false positive
                else          confusionMatrix[0][1]++ // false negative
            }
        })
        return confusionMatrix
    }


    getEvaluationMetrics(confusionMatrix) {
        const [
            [TP, FN],
            [FP, TN]
        ] = confusionMatrix
        const [precision, recall] = [TP / (TP + FP), TP / (TP + FN)]
        return {
            accuracy: (TP + TN) / (TP + TN + FP + FN),
            precision: precision,
            recall: recall,
            F1_score: 2 * (precision * recall) / (precision + recall),
            specificity: TN / (TN + FP),
            MCC: (TP*TN - FP*FN) / ((TP+FP)*(TP+FN)*(TN+FP)*(TN+FN))**0.5 // Matthews Correlation Coefficient
        }
    }

    /**
     * gamma adalah sebuah variabel sebagai constraint sehingga
     * a_r*y_r + a_s*y_s = gamma
     * karena : sum(a_i * y_i) = 0,
     * maka   : a_r*y_r + a_s*y_s = -sum(a_i * y_i ; i not in {r, s})
     *          a_r*y_r + a_s*y_s = gamma --> dijadikan variabel
     * @param {number} r index
     * @param {number} s index
     * @returns {number} value gamma
     */
    calcGamma(r, s) {
        let accumulator = 0
        for (let i=0; i<this.N; i++) {
            if (i === r || i === s) continue
            accumulator += this.alpha[i] * this.Y[i]
        }
        return -accumulator
    }

    /**
     * beta adalah sebuah variabel vektor, didefinisikan sbg:
     * beta = sum(a_i*y_i*x_i ; i not in {r, s})
     * mirip gamma, tapi vektor
     * @param {number} r index
     * @param {number} s index
     */
    calcBeta(r, s) {
        let accumulator = Array(this.P).fill(0)
        for (let i=0; i<this.N; i++) {
            if (i === r || i === s) continue
            accumulator = accumulator.map((acc_j, j) => acc_j + this.alpha[i] * this.Y[i] * this.X[i][j])
        }
        return accumulator
    }

    /**
     * calculate vector w based on alpha
     * @returns {number[]} weight w of the classifier
     */
    getWeight() {
        let accumulator = Array(this.P).fill(0)
        for (let i=0; i<this.N; i++) {
            accumulator = accumulator.map((acc_j, j) => acc_j + this.alpha[i] * this.Y[i] * this.X[i][j])
        }
        this.w = accumulator
        return this.w
    }

    /**
     * calculate bias b based on alpha
     * note: aku nggapaham rumus bias, jadi anggep aja gini
     * @returns {number} bias b of the classifier
     */
    getBias() {
        let n = 0
        let b = 0
        let w = this.getWeight()
        for (let i=0; i<this.N; i++) {
            if (this.alpha[i] === 0) continue 
            b += this.Y[i] - this.Math.dot(w, this.X[i])
            n++
        }
        this.b = b/n
        return this.b
    }


    Math = {
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
         * @param {Function} callback function yg menerima parameter x_i, y_i, i
         *                   mereturn hasil operasi x_i dan y_i.
         *                   dimana x_i, y_i elemen ke-i vektor x dan y
         * @returns {number[]} result
         */
        eachElements: (x, y, callback) => x.map((x_i, i) => callback(x_i, y[i], i)),

        /**
         * 
         * @param {number[]} x 
         * @returns jumlah dari array
         */
        sum: x => x.reduce((a, b) => a + b, 0),

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