class UtilityFunctions{
    /**
     * returns scientific notation for high values
     * @param value
     * @returns {*}
     */
    static getScientificNotation(value){
        let roundedValue=Math.round(value*100)/100;
        if(roundedValue.toString().length<7){
            return roundedValue;
        }
        else{
            return value.toExponential(2);
        }

    }

    /**
     * checks if a value is or might become a number
     * @param value
     * @returns {boolean}
     */
    static isValidValue(value){
        let isValid=false;
        if(!isNaN(value)||value==="."||value==="-"){
            isValid=true;
        }
        else{
            const lowerCase=value.toLowerCase();
            if(lowerCase.endsWith("e+")){
                let substring=lowerCase.substring(0,lowerCase.length-2);
                isValid=!isNaN(parseFloat(substring))&&!substring.includes("e+")
            }
            else if(lowerCase.endsWith("e")){
                let substring=lowerCase.substring(0,lowerCase.length-1);
                isValid=!isNaN(parseFloat(substring))&&!substring.includes("e")
            }
        }
        return isValid;
    }
}
export default UtilityFunctions;