import axios from 'axios';


class GenomeNexusAPI {
    /**
     * maps a HUGO Symbol to a entrez gene id
     * @param hgncSymbols
     * @returns {AxiosPromise<any>}
     */
    static genomNexusMappingMultipleSymbols(hgncSymbols) {
        return axios.post("https://genomenexus.org/ensembl/canonical-gene/hgnc", hgncSymbols);
    }

    getHugoSymbols(entrezIds, callback) {
        axios.post("https://genomenexus.org/ensembl/canonical-gene/entrez", entrezIds).then(function (response) {
            let mapper = {};
            response.data.forEach(d => {
                mapper[d.entrezGeneId] = d.hugoSymbol;
            });
            callback(mapper);
        }).catch(function (error) {
            if (GenomeNexusAPI.verbose) {
                console.log(error);
            }
            else {
                alert("invalid symbol")
            }
        })
    }

    getGeneIDs(hgncSymbols, callback) {
        GenomeNexusAPI.genomNexusMappingMultipleSymbols(hgncSymbols).then(function (response) {
            if (response.data.length === 0) {
                alert("No valid symbols found")
            }
            else {
                let invalidSymbols = [];
                hgncSymbols.forEach(function (d, i) {
                    if (!(response.data.map(entry => entry.hugoSymbol).includes(d))) {
                        invalidSymbols.push(d);
                    }
                });
                if (invalidSymbols.length !== 0) {
                    alert('WARNING the following symbols are not valid: ' + invalidSymbols);
                }
            }
            console.log(response.data);
            let hasEntrez=response.data.every(d=>d.hasOwnProperty("entrezGeneId"));
            if(hasEntrez) {
                callback(response.data.map(d => ({
                    hgncSymbol: d.hugoSymbol,
                    entrezGeneId: parseInt(d.entrezGeneId, 10)
                })));
            }
            else{
                alert("ERROR: Symbols could not be translated");
            }
        }).catch(function (error) {
            if (GenomeNexusAPI.verbose) {
                console.log(error);
            }
            else {
                alert("invalid symbol")
            }
        })
    }
}
GenomeNexusAPI.verbose=true;

export default GenomeNexusAPI;