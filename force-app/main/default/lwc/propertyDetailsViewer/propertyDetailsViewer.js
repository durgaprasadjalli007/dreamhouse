import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import getPropertyImages from '@salesforce/apex/BuyerAccountController.getPropertyImages';

import NAME_FIELD from '@salesforce/schema/Property__c.Name';
import TYPE_FIELD from '@salesforce/schema/Property__c.Property_Type__c';
import STATUS_FIELD from '@salesforce/schema/Property__c.Property_Status__c';
import BEDROOMS_FIELD from '@salesforce/schema/Property__c.Bedrooms__c';
import BATHROOMS_FIELD from '@salesforce/schema/Property__c.Bathrooms__c';
import PRICE_FIELD from '@salesforce/schema/Property__c.Listing_Price__c';
import ADDRESS_FIELD from '@salesforce/schema/Property__c.Property_Address__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Property__c.Property_Description__c';
import SQUARE_FEET_FIELD from '@salesforce/schema/Property__c.Square_Footage__c';
import YEAR_BUILT_FIELD from '@salesforce/schema/Property__c.Year_Built__c';
const PROPERTY_FIELDS = [
    NAME_FIELD, TYPE_FIELD, STATUS_FIELD, BEDROOMS_FIELD, BATHROOMS_FIELD,
    PRICE_FIELD, ADDRESS_FIELD, DESCRIPTION_FIELD, SQUARE_FEET_FIELD, YEAR_BUILT_FIELD
];

export default class PropertyDetailsViewer extends NavigationMixin(LightningElement) {
    @api recordId;
    @track propertyRecord;
    @track images = [];
    @track error;
    @track errorImages;

    defaultImage = 'https://via.placeholder.com/400x300?text=No+Image';

    @wire(getRecord, { recordId: '$recordId', fields: PROPERTY_FIELDS })
    wiredProperty({ data, error }) {
        if (data) {
            this.propertyRecord = data;
            this.error = undefined;
        } else if (error) {
            this.propertyRecord = undefined;
            this.error = error.body ? error.body.message : error.message;
        }
    }

    connectedCallback() {
        if (this.recordId) this.loadImages();
    }

    loadImages() {
        getPropertyImages({ propertyId: this.recordId })
            .then(result => {
                this.images = result.length
                    ? result.map(img => ({ id: img.Id, src: img.Image_Url__c || this.defaultImage }))
                    : [];
                this.errorImages = result.length ? undefined : 'No images found.';
            })
            .catch(error => {
                this.images = [];
                this.errorImages = error.body ? error.body.message : error.message;
            });
    }

    get name() { return getFieldValue(this.propertyRecord, NAME_FIELD) || '—'; }
    get type() { return getFieldValue(this.propertyRecord, TYPE_FIELD) || '—'; }
     get yearBuilt() { return getFieldValue(this.propertyRecord, YEAR_BUILT_FIELD) || '—'; }
    get bedrooms() { return getFieldValue(this.propertyRecord, BEDROOMS_FIELD) || '—'; }
    get bathrooms() { return getFieldValue(this.propertyRecord, BATHROOMS_FIELD) || '—'; }
    get price() {
        const val = getFieldValue(this.propertyRecord, PRICE_FIELD);
        return val ? `$${Number(val).toLocaleString()}` : '—';
    }
    get squareFeet() {
        const val = getFieldValue(this.propertyRecord, SQUARE_FEET_FIELD);
        return val ? `${val} sq.ft` : '—';
    }
    get address() { return getFieldValue(this.propertyRecord, ADDRESS_FIELD) || '—'; }
    get description() { return getFieldValue(this.propertyRecord, DESCRIPTION_FIELD) || '—'; }

    get statusLabel() {
        if (!this.propertyRecord) return '';
        return getFieldValue(this.propertyRecord, STATUS_FIELD) || 'Unknown';
    }

    get statusClass() {
        const s = (this.statusLabel || '').toLowerCase();
        if (s.includes('available')) return 'status-available';
        if (s.includes('sold')) return 'status-sold';
        if (s.includes('withdrawn')) return 'status-withdrawn';
        if (s.includes('under contract')) return 'status-undercontract';
        return 'status-default';
    }

    get statusBadgeClass() {
        return `status-badge ${this.statusClass}`;
    }

    handleContactClick() { this.navigateToNewInquiry('General Info'); }
    handleTourClick() { this.navigateToNewInquiry('Visit Request'); }

    navigateToNewInquiry(type) {
        const defaultFieldValues = Object.entries({ Property__c: this.recordId, Inquiry_Type__c: type })
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join('&');

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: { objectApiName: 'Property_Inquiry__c', actionName: 'new' },
            state: { defaultFieldValues }
        });
    }
}
