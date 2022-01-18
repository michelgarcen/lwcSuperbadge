import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';
import { publish, MessageContext } from 'lightning/messageService';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';


const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Length', fieldName: 'Length__c', editable: true },
    { label: 'Description', fieldName: 'Description__c', type: 'text', editable: true },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true }
  ];
  boatTypeId = '';
  boats;
  isLoading = false;

  // wired message context
  @wire(MessageContext)
    messageContext;

  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats(result) {
    if (result) {
      this.boats = result;
    } else if (result.error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.body.message,
          variant: ERROR_VARIANT
        })
      );
      this.isLoading = false;
    }
  }

  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
    this.boatTypeId = boatTypeId;
    this.notifyLoading(this.isLoading);
   }

  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
    async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);      
        await refreshApex(this.boats);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);        
    }

  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);

  }
  

  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    publish(this.messageContext, BoatMC, { recordId : boatId });
  }

  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({ data: updatedFields })
      .then(() => {
        this.refresh();
        refreshApex();
        this.dispatchEvent(
          new ShowToastEvent({
            title: SUCCESS_TITLE,
            message: MESSAGE_SHIP_IT,
            variant: SUCCESS_VARIANT
          })
        );
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: ERROR_TITLE,
            message: error.body.message,
            variant: ERROR_VARIANT
          })
        );
      })
      .finally(() => {
        this.notifyLoading(false);
        this.draftValues = [];
      });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) { 
    if (isLoading) {
      this.dispatchEvent(new CustomEvent('loading'));
  } else {
      this.dispatchEvent(CustomEvent('doneloading'));
  }
  }
}