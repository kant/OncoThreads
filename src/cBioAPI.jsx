import axios from 'axios';
import GenomeNexusAPI from "./GenomeNexusAPI";

/**
 * retrieves data using the cBio API
 */
class cBioAPI {
    constructor(studyId) {
        this.studyId = studyId;
        this.genomeNexusAPI = new GenomeNexusAPI();
    }

    /**
     * get all patients in a study
     * @param {returnDataCallback} callback
     */
    getPatients(callback) {
        axios.get("http://cbiohack.org/api/studies/" + this.studyId + "/patients?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC")
            .then(response => {
                callback(response.data.map(patient => patient.patientId));
            }).catch((error) => {
            if (cBioAPI.verbose) {
                console.log(error);
            }
            else {
                console.log("Could not load patients");
            }
        });
    }


    /**
     * get all events for all patients in a study
     * @param {string[]} patients
     * @param {returnDataCallback} callback
     */
    getEvents(patients, callback) {
        axios.all(patients.map(patient => axios.get("http://cbiohack.org/api/studies/" + this.studyId + "/patients/" + patient + "/clinical-events?projection=SUMMARY&pageSize=10000000&pageNumber=0&sortBy=startNumberOfDaysSinceDiagnosis&direction=ASC")))
            .then(eventResults => {
                let events = {};
                eventResults.forEach((response, i) => {
                    events[patients[i]] = response.data;
                });
                callback(events);
            }).catch((error) => {
            if (cBioAPI.verbose) {
                console.log(error);
            }
            else {
                console.log("Could not load events")
            }
        });
    }

    /**
     * get all available clinical sample data in a study
     * @param {returnDataCallback} callback
     */
    getClinicalPatientData(callback) {
        axios.get("http://cbiohack.org/api/studies/" + this.studyId + "/clinical-data?clinicalDataType=PATIENT&projection=DETAILED&pageSize=10000000&pageNumber=0&direction=ASC")
            .then(response => {
                callback(response.data);
            }).catch((error) => {
            if (cBioAPI.verbose) {
                console.log(error);
            }
            else {
                console.log("Could not load sample data")
            }
        });
    }

    /**
     * get all available molecular profiles for a study
     * @param {returnDataCallback} callback
     */
    getAvailableMolecularProfiles(callback) {
        axios.get("http://www.cbiohack.org/api/studies/" + this.studyId + "/molecular-profiles?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC")
            .then(response => {
                callback(response.data);
            }).catch((error) => {
            if (cBioAPI.verbose) {
                console.log(error);
            }
            else {
                console.log("Could not available molecular profiles")

            }
        });
    }

    /**
     * get all available clinical sample data in a study
     * @param {returnDataCallback} callback
     */
    getClinicalSampleData(callback) {
        axios.get("http://cbiohack.org/api/studies/" + this.studyId + "/clinical-data?clinicalDataType=SAMPLE&projection=DETAILED&pageSize=10000000&pageNumber=0&direction=ASC")
            .then(response => {
                callback(response.data);
            }).catch((error) => {
            if (cBioAPI.verbose) {
                console.log(error);
            }
            else {
                console.log("Could not load sample data")
            }
        });
    }

    /**
     *
     * @param {Object[]} entrezIDs
     * @param {string} profileId
     * @param {returnDataCallback} callback
     */
    getMutations(entrezIDs, profileId, callback) {
        axios.post("http://www.cbiohack.org/api/molecular-profiles/" + profileId + "/mutations/fetch?projection=DETAILED&pageSize=10000000&pageNumber=0&direction=ASC", {
            "entrezGeneIds":
                entrezIDs.map(d => d.entrezGeneId)
            ,
            "sampleListId": this.studyId + "_all"
        }).then(function (response) {
            callback(response.data)
        }).catch(function (error) {
            if (cBioAPI.verbose) {
                console.log(error);
            }
            else {
                console.log("Can't get mutations")
            }
        });
    }

    /**
     * checks for each sample if genes have been profiled
     * @param {Object[]} genes
     * @param {string} profileId
     * @param {returnDataCallback} callback
     */
    areProfiled(genes, profileId, callback) {
        let profiledDict = {};
        axios.post("http://www.cbiohack.org/api/molecular-profiles/" + profileId + "/gene-panel-data/fetch", {
                "sampleListId": this.studyId + "_all"
            }
        ).then(samplePanels => {
            let differentPanels = [...new Set(samplePanels.data.filter(d => d.hasOwnProperty("genePanelId")).map(d => d.genePanelId))];
            if (differentPanels.length > 0) {
                axios.all(differentPanels.map(d => axios.get("http://www.cbiohack.org/api/gene-panels/" + d))).then(panelList => {
                    samplePanels.data.forEach(samplePanel => {
                        profiledDict[samplePanel.sampleId] = [];
                        genes.forEach(gene => {
                            if (samplePanel.genePanelId !== undefined) {
                                if (panelList[panelList.map(panel => panel.data.genePanelId).indexOf(samplePanel.genePanelId)].data.genes.map(gene => gene.entrezGeneId).includes(gene.entrezGeneId)) {
                                    profiledDict[samplePanel.sampleId].push(gene.entrezGeneId);
                                }
                            }
                            else {
                                profiledDict[samplePanel.sampleId].push(gene.entrezGeneId);
                            }
                        });
                    });
                    callback(profiledDict);
                }).catch(function (error) {
                    if (cBioAPI.verbose) {
                        console.log(error);
                    }
                });
            }
            else {
                samplePanels.data.forEach(samplePanel => {
                    if (samplePanel.profiled) {
                        profiledDict[samplePanel.sampleId] = genes.map(d => d.entrezGeneId)
                    }
                    else {
                        profiledDict[samplePanel.sampleId] = [];
                    }
                });
                callback(profiledDict);
            }
        }).catch(function (error) {
            if (cBioAPI.verbose) {
                console.log(error);
            }
        });
    }

    /**
     * gets data for an array of entrezIds in a specified profile
     * @param {string} profileId
     * @param {Object[]} entrezIDs
     * @param {returnDataCallback} callback
     */
    getMolecularValues(profileId, entrezIDs, callback) {
        axios.post("http://www.cbiohack.org/api/molecular-profiles/" + profileId + "/molecular-data/fetch?projection=SUMMARY", {
            "entrezGeneIds":
                entrezIDs.map(d => d.entrezGeneId)
            ,
            "sampleListId": this.studyId + "_all"
        }).then(function (response) {
            callback(response.data)
        }).catch(function (error) {
            console.log(error)
        });
    }

    getGeneIDs(hgncSymbols, callback) {
        this.genomeNexusAPI.getGeneIDs(hgncSymbols, callback)
    }

}

cBioAPI.verbose = true;

export default cBioAPI;