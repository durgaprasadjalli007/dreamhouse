import { LightningElement, track, api } from 'lwc';

export default class StepTwo extends LightningElement {
    @api stepData;
    @track street = '';
    @track city = '';
    @track state = '';
    @track zip = '';

    connectedCallback() {
        if (this.stepData) {
            this.street = this.stepData.street || '';
            this.city = this.stepData.city || '';
            this.state = this.stepData.state || '';
            this.zip = this.stepData.zip || '';
        }
    }

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.value;
    }

    handleNext() {
        const inputs = [...this.template.querySelectorAll('input')];
        const allValid = inputs.reduce((validSoFar, input) => {
            input.reportValidity();
            return validSoFar && input.checkValidity();
        }, true);

        if (allValid) {
            const nextEvent = new CustomEvent('stepnext', {
                detail: {
                    stepNumber: 2,
                    data: {
                        street: this.street,
                        city: this.city,
                        state: this.state,
                        zip: this.zip
                    }
                }
            });
            this.dispatchEvent(nextEvent);
        } else {
            alert('Please fill all required fields correctly.');
        }
    }

    handlePrevious() {
        this.dispatchEvent(new CustomEvent('stepprevious', { detail: { stepNumber: 2 } }));
    }
}
