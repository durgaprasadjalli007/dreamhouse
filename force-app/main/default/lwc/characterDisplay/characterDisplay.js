import { LightningElement, track } from 'lwc';
import tomImage from '@salesforce/resourceUrl/TomImage';
import jerryImage from '@salesforce/resourceUrl/JerryImage';

export default class CharacterDisplay extends LightningElement {
    @track selectedCharacter = '';

    characterOptions = [
        { label: 'Tom', value: 'Tom' },
        { label: 'Jerry', value: 'Jerry' },
        { label: 'Both', value: 'Both' },
        { label: 'None', value: 'None' }
    ];

    get isTom() {
        return this.selectedCharacter === 'Tom';
    }

    get isJerry() {
        return this.selectedCharacter === 'Jerry';
    }

    get isBoth() {
        return this.selectedCharacter === 'Both';
    }

    get isNone() {
        return this.selectedCharacter === 'None' || this.selectedCharacter === '';
    }

    handleCharacterChange(event) {
        this.selectedCharacter = event.detail.value;
    }

    get tomSrc() {
        return tomImage;
    }

    get jerrySrc() {
        return jerryImage;
    }
}
