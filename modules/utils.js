/**
 * 
 * @param {string} content content of the file that will be downloaded
 * @param {string} filename filename of the file that will be downloaded
 */
function downloadTextFile(content, filename) {
    var blob = new Blob([content], { type: 'text/plain' })

    var a = document.createElement('a')
    a.href = window.URL.createObjectURL(blob);
    a.download = filename

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
}