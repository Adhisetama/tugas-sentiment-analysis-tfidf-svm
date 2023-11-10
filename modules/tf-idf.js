/**
 * WHAT TO DO:
 * 1. training
 * buat code untuk ngitung TF setiap dokumen
 * buat code untuk ngitung IDF dari semua dokumen
 * simpan tabel IDF
 * 
 * 2. parsing (dokumen --> feature vector)
 * hitung TF dokumen tsb
 * dari tabel IDF, kalikan TF dengan IDF
 * didapat feature vektor dgn dimensi tergantung banyaknya
 * term dalam vocab
 * 
 * 
 * ASUMSI:
 * - isi setiap dokumen sudah di preprocessing (stemming, dll)
 * - sudah didapatkan vocab
 * 
 * NOTES:
 * - rumus idf yang dipakai: idf(t) = ln(N / df(t))
 * - rumus tf yang dipakai: tf(t,d) = f(t,d) / sum(f(t_i,d))
 */

class TFIDF_Vectorizer {

    /**
     */
    constructor() {
        this.trainDocuments = []
        this.vocabulary = []
        this.idf = []
    }


    /**
     * 
     * @param {string[]} vocabulary array of terms
     */
    setVocabulary(vocabulary) {
        this.vocabulary = vocabulary
        this.idf.length = vocabulary.length
    }

    /**
     * 
     * @param  {...TFIDF_Document} trainDocument 
     */
    insertTrainDocuments(...trainDocument) {
        this.trainDocuments.push(...trainDocument)
    }

    calculateIDF() {
        this.vocabulary.forEach((term, term_index) =>  {
            // hitung df untuk setiap term
            let df = 0
            this.trainDocuments.forEach(trainDocument => {
                df += trainDocument.words.includes(term) ? 1 : 0
            })
            // hitung idf berdasar df
            console.log(df)
            this.idf[term_index] = Math.log(this.trainDocuments.length / df)
        })
    }

    vectorizeDocument(document) {
        const vector = [...this.idf]
        document.calculateTF(this.vocabulary).forEach((tf, index) => {
            vector[index] *= tf
        })
        return vector
    }

}

class TFIDF_Document {
    
    /**
     * @param {string[]} tokenizedWords 
     */
    constructor(tokenizedWords) {
        this.words = tokenizedWords

        // hitung semua okurensi term (bag of words)
        this.bagOfWords = {}
        for (const word of this.words) {
            if (word in this.bagOfWords){
                this.bagOfWords[word] += 1
            } else {
                this.bagOfWords[word] = 1
            }
        }
    }

    /**
     * @param {string[]} vocabulary 
     * @returns {Number[]} vektor dari TF
     */
    calculateTF(vocabulary) {
        const tf = Array(vocabulary.length)
        vocabulary.forEach((term, term_index) => {
            // rumus tf tanpa log
            tf[term_index] = term in this.bagOfWords ? this.bagOfWords[term] / this.words.length : 0
        })
        return tf
    }

}

/**
 * contoh cara pakai:
 * 
 * // definisikan term-term di vocabulary
 * const vocabulary <-- ["term1", "term2", ...]
 * const Vectorizer = new TFIDF_Vectorizer(vocabulary)
 * 
 * // load dataset
 * foreach d in dataset:
 *     const tokenizedWords = parseTokenizedWord(d)
 *     const document = new TFIDF_Document(tokenizedWords)
 *     Vectorizer.insertTrainDocuments(document)
 * 
 * // train
 * Vectorizer.calculateIDF()
 * 
 * // convert to feature vector
 * foreach d in dataset:
 *      X_train.push(Vectorizer.vectorizeDocument(d))
 *      Y_train.push(d.class)
 * 
 * // masukkan X_train Y_train ke dataset
 * // klasifikasikan dengan SVM
 */

