import { LightningElement, track } from 'lwc';

export default class StepOne extends LightningElement {
    @track name = '';
    @track email = '';
    @track phone = '';

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
                    stepNumber: 1,
                    data: {
                        name: this.name,
                        email: this.email,
                        phone: this.phone
                    }
                }
            });
            this.dispatchEvent(nextEvent);
        } else {
            alert('Please fill all required fields correctly.');
        }
    }
}
