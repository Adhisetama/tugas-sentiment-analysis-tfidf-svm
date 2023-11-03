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
 */

class TFIDF_Vectorizer {

    /**
     * @param {string[]} vocabulary 
     */
    constructor(vocabulary) {
        this.trainDocuments = []
        this.vocabulary = vocabulary
        this.idf = Array(vocabulary.length)
    }

    /**
     * @param {TFIDF_Document} trainDocument 
     */
    insertTrainDocuments(trainDocument) {
        this.trainDocuments.push(trainDocument)
    }

    calculateIDF() {
        this.vocabulary.forEach((term, term_index) =>  {
            // hitung df untuk setiap term
            let df = 0
            this.trainDocuments.forEach(trainDocument => {
                df += trainDocument.words.includes(term) ? 1 : 0
            })
            // hitung idf berdasar df
            this.idf[term_index] = Math.log10(this.trainDocuments.length / df)
        })
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
        for (const word of words) {
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
 * const Vectorizer = TFIDF_Vectorizer(vocabulary)
 * 
 * // load dataset
 * foreach d in dataset:
 *     const tokenizedWords = parseTokenizedWord(d)
 *     const document = TFIDF_Document(tokenizedWords)
 *     Vectorizer.insertTrainDocuments(document)
 */

