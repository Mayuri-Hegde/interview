import { LightningElement, track } from 'lwc';
import getZipCodeData from '@salesforce/apex/zipCodeController.getZipCodeData';

export default class ZipCodeComponent extends LightningElement {
    @track countryCode = '';
    @track postalCode = ''; 
    @track countryData = {};
    @track places = [];  
    @track showModal = false;
    @track isDataAvailable = false;
    
    handleCountryChange(event) {
        this.countryCode = event.target.value;
    }
    handlePostalCodeChange(event) {
        this.postalCode = event.target.value;
    }

    handleFetchData() {
        getZipCodeData({ countryCode: this.countryCode, postalCode: this.postalCode })
            .then(result => {
                const parsedResult = JSON.parse(result);
                this.countryData = {
                    country: parsedResult.country,
                    countryAbbreviation: parsedResult.countryAbbreviation,
                    postCode: parsedResult.postCode,
                };
                this.places = parsedResult.places.map(place => ({
                    placeName: place.placeName,
                    longitude: place.longitude,
                    state: place.state,
                    stateAbbreviation: place.stateAbbreviation,
                    latitude: place.latitude
                }));
                this.isDataAvailable = true;
                if(parsedResult.country === 'United States' || parsedResult.countryAbbreviation === 'US' || parsedResult.countryAbbreviation === 'us' || parsedResult.countryAbbreviation === 'Us'){
                    this.showModal = true;
                }
            })
            .catch(error => {
                console.error('Error:', error);  
                this.isDataAvailable = false;
            });
    }

    handleCloseModal(){
        this.showModal = false;
    }
}
