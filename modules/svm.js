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
     * @param {number} options.c hyperparameter C 
     * @param {number} options.e hyperparameter epsilon (error tolerance)
     */
    constructor(X_train, Y_train, options={}) {
        // input parameter
        this.X_train = X_train // array berisi vektor x_i
        this.Y_train = Y_train // array berisi class  y_i
                
        // variabel untuk perhitungan SVM
        this.N = X_train.length
        this.alpha = Array(this.N)                           // parameter alpha di lagrange multiplier
        this.c = options.c !== undefined ? options.c : 10    // hyperparameter C. default=10
        this.e = options.e !== undefined ? options.e : 0.01  // hyperparameter epsilon (error tolerance). default=0.01
    }



}

const SVM_Math = {
    /**
     * dot product vektor
     * note: belum ada param checking di function ini
     * @param {number[]} x 
     * @param {number[]} y 
     * @returns {number[]} hasil dot product vektor x dan y
     */
    dot: (x, y) => x.map((x_i, i) => x_i * y[i]),

    /**
     * 
     * @param {number[]} x 
     * @returns jumlah dari array
     */
    sum: x => x.reduce((a, b) => a + b, 0)
}